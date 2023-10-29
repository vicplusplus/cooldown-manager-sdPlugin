/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const myAction = new Action('com.vicplusplus.cooldown');
var keyboardListenerSocket;
var streamDeckSocket;
var interval;

var ctx_to_data = {}

myAction.onWillAppear(refresh);
myAction.onDidReceiveSettings(({ context, payload }) => {
	refresh({ context, payload });
	console.log(JSON.stringify(payload.settings))
});
myAction.onKeyDown(({ context }) => {
	resetCooldown(context);
});

setInterval(() => {
	for (let ctx in ctx_to_data) {
		updateTitle(ctx);
		if (getTime(ctx) == 0 && !ctx_to_data[ctx].ended) {
			onCooldownEnd(ctx)
		}
	}
}, 1000);

function refresh({ context, payload }) {
	ctx_to_data[context] = {
		context,
		lastResetTime: 0,
		payload,
		ended: true,
	};

	wipeCooldowns();

	if (keyboardListenerSocket && keyboardListenerSocket.readyState === WebSocket.OPEN) {
		sendKeys();
	}
	else {
		connectToKeyboardListener();
	}
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

function onCooldownEnd(context) {
	let data = ctx_to_data[context]
	console.log(JSON.stringify(data.payload.settings.audio))
	data.ended = true;
}

function resetCooldown(context) {
	let data = ctx_to_data[context];
	if (!data.payload.settings.forceTimeout || getTime(context) === 0) {
		data.lastResetTime = Date.now();
		data.ended = false;
	}
}

function connectToKeyboardListener() {
	if (keyboardListenerSocket === undefined || keyboardListenerSocket.readyState === WebSocket.CLOSED) {
		keyboardListenerSocket = new WebSocket("ws://localhost:8765");
		keyboardListenerSocket.onopen = sendKeys;
		keyboardListenerSocket.onmessage = (event) => {
			resetCooldown(event.data);
		}
	}
}

function sendKeys() {
	for (let ctx in ctx_to_data) {
		keyboardListenerSocket.send(JSON.stringify({ context: ctx, payload: ctx_to_data[ctx].payload }));
	}
}

function wipeCooldowns() {
	for (let ctx in ctx_to_data) {
		ctx_to_data[ctx].lastResetTime = 0;
		ctx_to_data[ctx].ended = true;
	}
}

