"""Server for Raspberry Pi temperature monitoring app"""

import os
import asyncio
from subprocess import getoutput

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from websockets.exceptions import ConnectionClosedOK
import paramiko

import random  # debug

app = FastAPI()


INTERVAL = 1.5


async def raspberry2_generator() -> float:
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

    except Exception as e:
        print(f"An error occurred: {str(e)}")


async def raspberry1_generator() -> float:
    """get temperature from device"""
    # while True:
    #     yield random.random() * 100
    #     await asyncio.sleep(1)
    while True:
        raw_text = getoutput("vcgencmd measure_temp")
        float_text = raw_text.removeprefix("temp=").removesuffix("'C")
        yield float(float_text)
        await asyncio.sleep(INTERVAL)


@app.websocket("/raspberry2")
async def liveupdate2(websocket: WebSocket):
    """sends live update of device temperature"""
    await websocket.accept()
    try:
        async for data in raspberry2_generator():
            await websocket.send_json({"data": data})
    except ConnectionClosedOK:
        pass


@app.websocket("/raspberry1")
async def liveupdate(websocket: WebSocket):
    """sends live update of device temperature"""
    await websocket.accept()
    try:
        async for data in raspberry1_generator():
            await websocket.send_json({"data": data})
    except ConnectionClosedOK:
        pass
    # while websocket.client_state != 3:  # 3 = closed
    #     try:
    #         await asyncio.sleep(1)
    #         await websocket.send_json({"data": await get_temp_rasp1()})
    #     except ConnectionClosedOK:
    #         break


# mount dist folder
app.mount("/", StaticFiles(directory="dist", html=True), name="dist")
