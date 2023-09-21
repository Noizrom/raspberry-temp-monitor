import asyncio
from subprocess import getoutput

from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from websockets.exceptions import ConnectionClosedOK

app = FastAPI()


async def get_temperature() -> float:
    """get temperature from device"""
    # debug: generate random temparature value
    raw_text = getoutput("vcgencmd measure_temp")
    float_text = raw_text.removeprefix("temp=").removesuffix("'C")
    return float(float_text)


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
