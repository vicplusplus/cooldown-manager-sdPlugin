/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const myAction = new Action('com.vicplusplus.cooldown');
var keyboardListenerSocket;
var streamDeckSocket;

var ctx_to_data = {}

myAction.onWillAppear(refresh);
myAction.onDidReceiveSettings(refresh)
myAction.onKeyDown(refresh);

function refresh({ context, payload }) {

	console.log(`refreshing ${context} with ${JSON.stringify(payload)}`);
	ctx_to_data[context] = {
		context,
		lastResetTime: 0,
		payload,
		interval: null
	}

	connectToKeyboardListener();
}

function updateTitle(context) {
	let time = getTime(context);
	$SD.setTitle(context, (time != 0) ? time.toFixed(0) : "")
}

function getTime(context) {
	let lastResetTime = ctx_to_data[context].lastResetTime;
	let timerLength = ctx_to_data[context].payload.settings.length
	return Math.max(timerLength - (Date.now() - lastResetTime) / 1000, 0);
}

function connectToKeyboardListener() {
	if (keyboardListenerSocket === undefined || keyboardListenerSocket.readyState === WebSocket.CLOSED) {
		keyboardListenerSocket = new WebSocket("ws://localhost:8765");
		keyboardListenerSocket.onopen = () => {
			for (let ctx in ctx_to_data) {
				keyboardListenerSocket.send(JSON.stringify({ context: ctx, payload: ctx_to_data[ctx].payload }));
			}
		}
		keyboardListenerSocket.onmessage = (event) => {
			let context = event.data;
			let data = ctx_to_data[context];
			if (!data.payload.settings.forceTimeout || getTime(context) === 0)
				data.lastResetTime = Date.now();
			if (data.interval) {
				clearInterval(data.interval);
			}
			updateTitle(context);
			data.interval = setInterval(updateTitle, 1000, context);
		}
	}
}