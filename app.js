const express = require('express');
const app = express();
const server = require('https').Server(app);
const url = require('url');

const WebSocket = require('ws');

const port = process.env.PORT|3001;
const express_config= require('./config/express.js');

express_config.init(app);

const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });



var cameraArray={};

//esp32cam websocket
wss1.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss2.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

//webbrowser websocket
wss2.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
  	// nothing here should be received
    console.log('received wss2: %s', message);
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/jpgstream_server') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/jpgstream_client') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});



app.get('/', (req, res) => {
  	res.render('index', {});
});


server.listen(port, () => {
	  console.log(`App listening at https://localhost:${port}`)
})

//********************************************** */

// HTTPS for deploying on Render

//********************************************** */
// const path = require("path");
// const express = require("express");
// const WebSocket = require("ws");
// const fs = require("fs");
// const https = require("https");
// const url = require('url');
// var privateKey = fs.readFileSync("server.key", "utf8");
// var certificate = fs.readFileSync("server.cert", "utf8");
// var credentials = { key: privateKey, cert: certificate };

// const HTTPS_PORT = 443;
// const app = express();
// const httpsServer = https.createServer(credentials, app);
// //const wsServer = new WebSocket.Server({ server: httpsServer });
// const wss1 = new WebSocket.Server({ noServer: true });
// const wss2 = new WebSocket.Server({ noServer: true });
// let connectedClients = [];


// const express_config= require('./config/express.js');

// express_config.init(app);

// //esp32cam websocket
// wss1.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     wss2.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
// });

// //webbrowser websocket
// wss2.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//   	// nothing here should be received
//     console.log('received wss2: %s', message);
//   });
// });

// httpsServer.on('upgrade', function upgrade(request, socket, head) {
//   const pathname = url.parse(request.url).pathname;

//   if (pathname === '/jpgstream_server') {
//     wss1.handleUpgrade(request, socket, head, function done(ws) {
//       wss1.emit('connection', ws, request);
//     });
//   } else if (pathname === '/jpgstream_client') {
//     wss2.handleUpgrade(request, socket, head, function done(ws) {
//       wss2.emit('connection', ws, request);
//     });
//   } else {
//     socket.destroy();
//   }
// });






// // wsServer.on("connection", (ws, req) => {
// // 	console.log("Connected");

// // 	ws.on("message", (data) => {
// // 		if (data.indexOf("WEB_CLIENT") !== -1) {
// // 			connectedClients.push(ws);
// // 			console.log("WEB_CLIENT ADDED");
// // 			return;
// // 		}

// // 		connectedClients.forEach((ws, i) => {
// // 			if (connectedClients[i] == ws && ws.readyState === ws.OPEN) {
// // 				ws.send(data);
// // 			} else {
// // 				connectedClients.splice(i, 1);
// // 			}
// // 		});
// // 	});

// // 	ws.on("error", (error) => {
// // 		console.error("WebSocket error observed: ", error);
// // 	});
// // });

// app.use(express.static("."));
// // app.get("/client", (req, res) => res.sendFile(path.resolve(__dirname, "./views/index.ejs")));
// app.get('/', (req, res) => {
//   	res.render('index', {});
// });

// httpsServer.listen(HTTPS_PORT, () => console.log(`HTTPS server listening at ${HTTPS_PORT}`));



