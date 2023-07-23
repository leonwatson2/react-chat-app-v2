import express from 'express'
import { Server } from "socket.io";
import { createServer } from 'http';
import { SocketManager } from './socketManager.js'

const app = express()

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const origin = ["https://vlw2.com","http://vlw2.com", "http://localhost:3000","http://localhost"]

export const io = new Server(server, {
  cors: {
    origin,
    credentials: true,
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
  },
  allowEIO3: true,
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST",
      "Access-Control-Allow-Credentials": true
    });
    res.end();
  }
});
app.get('/', (req, res) => {
  res.write(`<h1>Server is running on port ${PORT}</h1>, the origin is ${origin.reduce((acc, curr) => acc + curr + " ", "")}`);
  res.end();
});

io.on('connection', SocketManager);

server.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});

