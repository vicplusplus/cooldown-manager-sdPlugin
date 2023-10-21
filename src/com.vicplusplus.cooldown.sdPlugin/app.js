/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const myAction = new Action('com.vicplusplus.cooldown');
var keyboardListenerSocket;
var streamDeckSocket;
var lastResetTime;
var interval;

myAction.onKeyDown(({ action, context, device, event, payload }) => {
	if (keyboardListenerSocket === undefined || keyboardListenerSocket.readyState === WebSocket.CLOSED) {
		keyboardListenerSocket = new WebSocket("ws://localhost:8765");
		keyboardListenerSocket.onopen = (event) => {
			keyboardListenerSocket.send(JSON.stringify(payload));
		}
		keyboardListenerSocket.onmessage = (event) => {
			if (!payload.settings.forceTimeout || getTime(payload) === 0)
				lastResetTime = Date.now();
			if (interval) clearInterval(interval);
			updateTitle(context, payload);
			interval = setInterval(updateTitle, 1000, context, payload);
		}
		keyboardListenerSocket.onclose = (event) => {
			clearInterval(interval);
		}
	}

	if (keyboardListenerSocket.readyState === WebSocket.OPEN) {
		keyboardListenerSocket.send(JSON.stringify(payload));
	}
});

function updateTitle(context, payload) {
	let time = getTime(payload);

	$SD.setTitle(context, (time != 0) ? time.toFixed(0) : "")
}

function getTime(payload) {
	return Math.max(payload.settings.length - (Date.now() - lastResetTime) / 1000, 0);
}