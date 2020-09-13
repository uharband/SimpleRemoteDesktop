var net = require('net');
var userSocket = null;
var port = 8001;
if(process.env.port !== undefined){
	port = process.env.port;
	console.log('port overridden by env to be ' + port);
}
if (process.argv.length > 2) {
	let portFormArgs = parseInt(process.argv[2]);
	if(!isNaN(portFormArgs)) {
		port = portFormArgs;
		console.log('port overridden by args to be ' + port);
	}
}
var port = process.env.port || 8001;
var onNewMessageHandler = null;
var disconnectHander = null;

var buffer = new Buffer(0);

module.exports.getSocket = function() {
	return userSocket;
};

module.exports.getPort = function() {
	return port;
}

module.exports.registerMessageHandler = function(mh) {
	onNewMessageHandler = mh;
}

module.exports.registerdisconnectHander = (dd) => disconnectHander = dd;
module.exports.getWriteFn = function() {
	if (userSocket) return userSocket.write();
	console.log("!!! WARN no socket");
	return null;
}

var server = net.createServer(function(socket) {
	console.log("new socket connected");
	if (!userSocket) {
		console.log("set new userSocket");
		userSocket = socket;


	} else {
		socket.end();
		disconnectHander();
	}

	socket.on('close', function() {
		console.log("Socket Disconnected");
		if (userSocket === socket) {
			userSocket = null;
		}
	})
		.on('data', function(data) {
			messageHandler(data);
		})
		.on('error', function() {
			disconnectHander();
			console.log("error on socket");
		});


});



server.listen(port, function() {
	console.log("tcp socket open on port " + port);
});

function messageHandler(data) {
	buffer = Buffer.concat([buffer, data]);

	while (buffer.length >= 40) {


		var message = {
			type: parseInt(read(4).readInt32LE().toString(), 10),
			x: read(4).readFloatLE(),
			y: read(4).readFloatLE(),
			button: parseInt(read(4).readInt32LE().toString(), 10),
			keycode: parseInt(read(4).readInt32LE().toString(), 10),
			codecWidth: parseInt(read(4).readInt32LE().toString(), 10),
			codecHeight: parseInt(read(4).readInt32LE().toString(), 10),
			bandwidth: parseInt(read(4).readInt32LE().toString(), 10),
			fps: parseInt(read(4).readInt32LE().toString(), 10),
			sdl: parseInt(read(4).readInt32LE().toString(), 10)
		}

		//console.log(message);
		onNewMessageHandler(message);
	}
}


function read(length, cb) {
	var data = new Buffer(length);
	buffer.copy(data, 0, 0, length);
	buffer = buffer.slice(length, buffer.length);
	return data;

}
