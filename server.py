"""Server for Raspberry Pi temperature monitoring app"""
# pylint: disable=broad-except

import os
import random  # debug
import asyncio
from subprocess import getoutput
from enum import Enum

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
import paramiko


app = FastAPI()


DEV = False
INTERVAL = 1.5


class Devices(Enum):
    """devices"""

    RASPBERRY1 = "raspberry1"
    RASPBERRY2 = "raspberry2"


def wrap_for_dev(func):
    """wrap function for development"""
    if DEV:
        print("DEV MODE")

        async def wrapper():
            while True:
                yield random.randint(0, 100)
                await asyncio.sleep(INTERVAL)

        return wrapper
    else:
        return func


@wrap_for_dev
async def raspberry2_generator() -> float:
    """a generator for raspberry2 temperature"""
    # Initialize an SSH client
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ssh_host = os.getenv("RASP2_HOST")
    ssh_port = os.getenv("RASP2_PORT")
    ssh_user = os.getenv("RASP2_USER")
    ssh_pass = os.getenv("RASP2_PASS")

    try:
        print(f"Connecting to {ssh_host}:{ssh_port}...")
        # Connect to the remote SSH server
        ssh_client.connect(ssh_host, ssh_port, ssh_user, ssh_pass)

        # Execute the command in an infinite loop
        while True:
            # Execute the command and read the output
            _, stdout, _ = ssh_client.exec_command("vcgencmd measure_temp")
            temp_output = stdout.read().decode("utf-8").strip()

            # Parse the temperature value (e.g., "temp=54.2'C" -> 54.2)
            temperature = float(temp_output.split("=")[1].split("'")[0])

            # Print the temperature (you can replace this with your desired logic)
            # print(f"Current temperature: {temperature}°C")
            yield float(temperature)

            # Wait for one second before the next iteration
            await asyncio.sleep(INTERVAL)

    except Exception as error:
        print(f"An error occurred: {str(error)}")


@wrap_for_dev
async def raspberry1_generator() -> float:
    """get temperature from device"""
    while True:
        raw_text = getoutput("vcgencmd measure_temp")
        float_text = raw_text.removeprefix("temp=").removesuffix("'C")
        yield float(float_text)
        await asyncio.sleep(INTERVAL)


class Broadcaster:
    """Manages websocket connections"""

    def __init__(self):
        self.subscribers: dict[str, list] = {}

    async def subscribe(self, device: Devices, websocket: WebSocket):
        """subscribe to a device"""
        await websocket.accept()
        subpar = self.subscribers.get(device, [])
        subpar.append(websocket)
        self.subscribers[device] = subpar

    async def update_rasp1_subscribers(self):
        """update subscribers of raspberry1"""
        async for new_data in raspberry1_generator():
            subscribers = self.subscribers.get(Devices.RASPBERRY1, [])

            # will loop here until there is a subscriber
            while not subscribers:
                # print("No Subscriber. not asking for new data")
                await asyncio.sleep(2)
                subscribers = self.subscribers.get(Devices.RASPBERRY1, [])

            for subscriber in self.subscribers.get(Devices.RASPBERRY1, []):
                try:
                    await subscriber.send_json({"data": new_data})
                except (ConnectionClosedOK, ConnectionClosedError):
                    print("A subscriber is disconnected. removing.. .")
                    for sub in self.subscribers[Devices.RASPBERRY1]:
                        if sub == subscriber:
                            self.subscribers[Devices.RASPBERRY1].remove(sub)
                            print("Removed : ", sub)
                            break
                except Exception as error:
                    print("Unhandled Exemption : ", error)
                    continue

    async def update_rasp2_subscribers(self):
        """update subscribers of raspberry2"""
        async for new_data in raspberry2_generator():
            subscribers = self.subscribers.get(Devices.RASPBERRY2, [])
            while not subscribers:
                # print("No Subscriber. not asking for new data")
                await asyncio.sleep(2)
                subscribers = self.subscribers.get(Devices.RASPBERRY2, [])

            for subscriber in self.subscribers.get(Devices.RASPBERRY2, []):
                try:
                    await subscriber.send_json({"data": new_data})
                except (ConnectionClosedOK, ConnectionClosedError):
                    print("A subscriber is disconnected. removing.. .")
                    for sub in self.subscribers[Devices.RASPBERRY2]:
                        if sub == subscriber:
                            self.subscribers[Devices.RASPBERRY2].remove(sub)
                            print("Removed : ", sub)
                            break
                except Exception as error:
                    print("Unhandled Exemption : ", error)
                    continue

    async def begin_if_someone_subscribed(self):
        """begin updating if someone subscribed"""
        print("=begin_if_someone_subscribed=")
        ras1_task = asyncio.create_task(self.update_rasp1_subscribers())
        ras2_task = asyncio.create_task(self.update_rasp2_subscribers())
        await asyncio.gather(ras1_task, ras2_task)


broadcaster = Broadcaster()


@app.on_event("startup")
async def startup_event():
    """start background tasks"""
    asyncio.create_task(broadcaster.begin_if_someone_subscribed())


@app.websocket("/raspberry2")
async def liveupdate2(websocket: WebSocket):
    """sends live update of device temperature"""
    await broadcaster.subscribe(Devices.RASPBERRY2, websocket)
    while websocket.client_state != 3:  # keeps the connection alive
        await asyncio.sleep(10)


@app.websocket("/raspberry1")
async def liveupdate(websocket: WebSocket):
    """sends live update of device temperature"""
    await broadcaster.subscribe(Devices.RASPBERRY1, websocket)
    while websocket.client_state != 3:  # keeps the connection alive
        await asyncio.sleep(10)


# mount dist folder
app.mount("/", StaticFiles(directory="dist", html=True), name="dist")
