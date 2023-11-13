#!/usr/bin/env python
import json
import asyncio
import keyboard
import datetime, time
from websockets.server import serve

ctx_to_event = {}


async def handle(websocket):
    print("New connection established.")
    async for message in websocket:
        await register_cooldown_hotkey(json.loads(message), websocket)


async def main():
    print("WebSocket server started. Awaiting connections on 'localhost:8765'...")
    async with serve(handle, "localhost", 8765, ping_interval=0.1):
        await asyncio.Future()  # run forever


async def register_cooldown_hotkey(data, ws):
    if data["context"] in ctx_to_event:
        remove_cooldown_hotkey(data["context"])
    try:
        add_cooldown_hotkey(data["context"], data["payload"]["settings"]["keycode"], ws)
    except KeyError:
        print("Error: Received message is missing a required key.")


async def update_client(ws, ctx):
    try:
        d = datetime.datetime.now()
        for_js = int(time.mktime(d.timetuple())) * 1000
        await ws.send(json.dumps({"context": ctx, "time": for_js}))
        _, key = ctx_to_event[ctx]
        print("fired", key)
    except:
        print(f"Error updating client. Closing connection.")
        await ws.close()
        remove_cooldown_hotkey(ctx)


def remove_cooldown_hotkey(ctx):
    event, key = ctx_to_event[ctx]
    keyboard.remove_hotkey(event)
    ctx_to_event.pop(ctx)
    print(f"Key '{key}' has been unregistered.")


def add_cooldown_hotkey(ctx, key, ws):
    try:
        event = keyboard.add_hotkey(key, lambda: asyncio.run(update_client(ws, ctx)))
        ctx_to_event[ctx] = (event, key)
        print(f"Key '{key}' has been registered.")
    except ValueError:
        print(f"Error: Invalid key '{key}'. Ignoring.")


asyncio.run(main())
