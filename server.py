"""Server for Raspberry Pi temperature monitoring app"""
# pylint: disable=broad-except

import asyncio
import os
import random  # debug
from enum import Enum
from subprocess import getoutput
import sys
from typing import AsyncGenerator, Callable, Optional, TypeVar

import paramiko
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from loguru import logger
from pydantic import BaseModel
from starlette.websockets import WebSocketState
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK

app = FastAPI()

DEV = False
INTERVAL = 1.5

logger.info(f"SERVER RUNNING IN {'DEV' if DEV else 'PROD'} MODE")
if not DEV:
    logger.configure(
        handlers=[
            {"sink": sys.stdout, "level": "WARNING"},
        ]
    )

# if anext is not defined in global scope
if not "anext" in globals():
    logger.warning("anext is not defined in global scope. defining...")
    T = TypeVar("T")

    async def anext(ait: AsyncGenerator[T, None]) -> T:
        return await ait.__anext__()


class Devices(Enum):
    """devices"""

    RASPBERRY1 = "raspberry1"
    RASPBERRY2 = "raspberry2"


class GeneratorResponse(BaseModel):
    """response from generator"""

    successful: bool
    result: Optional[float]
    error: Optional[str]


def wrap_for_dev(func: Callable[[], AsyncGenerator[GeneratorResponse, None]]):
    """wrap function for development"""
    if not DEV:
        return func

    async def wrapper() -> AsyncGenerator[GeneratorResponse, None]:
        while True:
            yield GeneratorResponse(
                successful=True,
                result=random.randint(0, 100),
                error=None,
            )

    return wrapper


@wrap_for_dev
async def raspberry2_generator() -> AsyncGenerator[GeneratorResponse, None]:
    """a generator for raspberry2 temperature"""
    # Initialize an SSH client
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ssh_host = os.getenv("RASP2_HOST")
    ssh_port = os.getenv("RASP2_PORT")
    ssh_user = os.getenv("RASP2_USER")
    ssh_pass = os.getenv("RASP2_PASS")

    if not ssh_host or not ssh_port or not ssh_user or not ssh_pass:
        logger.error("Raspberry 2 credentials not found")
        yield GeneratorResponse(
            successful=False, result=0, error="Raspberry 2 credentials not found"
        )
    else:
        try:
            logger.debug(f"Connecting to {ssh_host}:{ssh_port}...")
            # Connect to the remote SSH server
            ssh_client.connect(ssh_host, int(ssh_port), ssh_user, ssh_pass)

            # Execute the command in an infinite loop
            while True:
                # Execute the command and read the output
                _, stdout, _ = ssh_client.exec_command("vcgencmd measure_temp")
                temp_output = stdout.read().decode("utf-8").strip()

                # Parse the temperature value (e.g., "temp=54.2'C" -> 54.2)
                temperature = float(temp_output.split("=")[1].split("'")[0])

                yield GeneratorResponse(successful=True, result=temperature, error=None)

        except Exception as error:
            logger.error("An error occurred: ")
            logger.error(error)

            yield GeneratorResponse(successful=False, result=0, error=str(error))


@wrap_for_dev
async def raspberry1_generator() -> AsyncGenerator[GeneratorResponse, None]:
    """get temperature from device"""
    while True:
        raw_text = getoutput("vcgencmd measure_temp")
        float_text = raw_text.removeprefix("temp=").removesuffix("'C")
        yield GeneratorResponse(successful=True, result=float(float_text), error=None)


class Broadcaster:
    """Manages websocket connections"""

    def __init__(self):
        self.subscribers: dict[Devices, list[WebSocket]] = {}

    async def subscribe(self, device: Devices, websocket: WebSocket):
        """subscribe to a device"""
        await websocket.accept()

        subpar = self.subscribers.get(device, [])
        subpar.append(websocket)

        self.subscribers[device] = subpar

    async def update_subscribers(
        self,
        device: Devices,
        generator: Callable[[], AsyncGenerator[GeneratorResponse, None]],
    ):
        """common function for updating subscribers"""
        # async for new_data in generator():
        data_generator = generator()
        while True:
            subscribers: list[WebSocket] = []

            while not (
                subscribers := self.subscribers.get(device, [])
            ):  # poll until there is a subscriber
                await asyncio.sleep(INTERVAL)

            new_data = await anext(
                data_generator
            )  # will only get data when there is a subscriber
            logger.trace(f"Sending to {len(subscribers)} subscribers")

            for subscriber in subscribers:
                try:
                    response = {
                        "successful": new_data.successful,
                        "result": new_data.result,
                        "error": new_data.error,
                    }
                    # logger.debug(f"Sending {str(response)}")
                    await subscriber.send_json(response)
                except (ConnectionClosedOK, ConnectionClosedError):
                    logger.trace("A subscriber is disconnected. removing.. .")
                    for sub in self.subscribers[device]:
                        if sub == subscriber:
                            self.subscribers[device].remove(sub)
                            logger.trace("A subscriber is removed.")
                            break
                except Exception as error:
                    logger.critical("Unhandled Exemption : ")
                    logger.critical(error)
                    break

            await asyncio.sleep(INTERVAL)

    async def start_background(self):
        """Starts background tasks"""

        ras1_task = asyncio.create_task(
            self.update_subscribers(Devices.RASPBERRY1, raspberry1_generator)
        )
        ras2_task = asyncio.create_task(
            self.update_subscribers(Devices.RASPBERRY2, raspberry2_generator)
        )
        await asyncio.gather(ras1_task, ras2_task)


broadcaster = Broadcaster()


@app.on_event("startup")
async def startup_event():
    """start background tasks"""
    asyncio.create_task(broadcaster.start_background())


@app.websocket("/raspberry2")
async def liveupdate2(websocket: WebSocket):
    """sends live update of device temperature"""
    await broadcaster.subscribe(Devices.RASPBERRY2, websocket)
    while websocket.client_state != WebSocketState.DISCONNECTED:
        await asyncio.sleep(10)
    logger.warning("Websocket Disconnected")


@app.websocket("/raspberry1")
async def liveupdate(websocket: WebSocket):
    """sends live update of device temperature"""
    logger.success("Connected to r1")
    await broadcaster.subscribe(Devices.RASPBERRY1, websocket)
    while websocket.client_state != WebSocketState.DISCONNECTED:
        await asyncio.sleep(10)
    logger.warning("Websocket Disconnected")


# mount dist folder
app.mount("/", StaticFiles(directory="dist", html=True), name="dist")
