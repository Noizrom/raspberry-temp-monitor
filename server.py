import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from websockets.exceptions import ConnectionClosedOK

import random

app = FastAPI()


async def get_temperature() -> float:
    """get temperature from device"""
    # debug: generate random temparature value
    return random.randint(0, 100)


@app.websocket("/ws")
async def liveupdate(websocket: WebSocket):
    """sends live update of device temperature"""
    await websocket.accept()
    while websocket.client_state != 3:  # 3 = closed
        try:
            await asyncio.sleep(1)
            await websocket.send_json({"temperature": await get_temperature()})
        except ConnectionClosedOK:
            break


# mount dist folder
app.mount("/", StaticFiles(directory="dist", html=True), name="dist")
