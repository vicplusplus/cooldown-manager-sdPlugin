#!/usr/bin/env python
import json
import asyncio
import keyboard
from websockets.server import serve

pos_to_ws = {}


async def handle(websocket):
    async for message in websocket:
        await register_cooldown_hotkey(json.loads(message), websocket)


async def main():
    async with serve(handle, "localhost", 8765):
        await asyncio.Future()  # run forever


async def register_cooldown_hotkey(data, ws):
    key = data["settings"]["keycode"]

    pos = "{}{}".format(data["coordinates"]["column"], data["coordinates"]["row"])

    if pos in pos_to_ws:
        remove_cooldown_hotkey(pos)

    add_cooldown_hotkey(pos, key, ws)


async def update_client(pos):
    try:
        await pos_to_ws[pos][0].send("reset")
        print("fired", pos)
    except:
        await pos_to_ws[pos][0].close()
        remove_cooldown_hotkey(pos)


def remove_cooldown_hotkey(pos):
    keyboard.remove_hotkey(pos_to_ws[pos][1])
    pos_to_ws.pop(pos)
    print("removed", pos)


def add_cooldown_hotkey(pos, key, ws):
    event = keyboard.add_hotkey(key, lambda: asyncio.run(update_client(pos)))
    pos_to_ws[pos] = [ws, event]
    print("registered", key)


asyncio.run(main())
