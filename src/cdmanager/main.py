#!/usr/bin/env python
import json
import asyncio
import keyboard
from websockets.server import serve

ctx_to_event = {}


async def handle(websocket):
    async for message in websocket:
        await register_cooldown_hotkey(json.loads(message), websocket)


async def main():
    async with serve(handle, "localhost", 8765):
        await asyncio.Future()  # run forever


async def register_cooldown_hotkey(data, ws):
    if data["context"] in ctx_to_event:
        remove_cooldown_hotkey(data["context"])
    try:
        add_cooldown_hotkey(data["context"], data["payload"]["settings"]["keycode"], ws)
    except KeyError:
        print("Missing key")


async def update_client(ws, ctx):
    try:
        await ws.send(ctx)
        print("fired", ctx)
    except:
        await ws.close()
        remove_cooldown_hotkey(ctx)


def remove_cooldown_hotkey(ctx):
    keyboard.remove_hotkey(ctx_to_event[ctx])
    ctx_to_event.pop(ctx)
    print("removed", ctx)


def add_cooldown_hotkey(ctx, key, ws):
    try:
        event = keyboard.add_hotkey(key, lambda: asyncio.run(update_client(ws, ctx)))
        ctx_to_event[ctx] = event
        print("registered", key)
    except ValueError:
        print("invalid key", key, "(ignoring)")


asyncio.run(main())
