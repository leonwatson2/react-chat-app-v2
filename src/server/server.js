import express from 'express'
import { Server } from "socket.io";
import { createServer } from 'http';
import { SocketManager } from './socketManager.js'

const app = express()

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const origin = "https://vlw2.com"

export const io = new Server(server, {
  cors: {
    origin
  },
  credentials: true
});
app.get('/', (req, res) => {
  res.write(`<h1>Server is running on port ${PORT}</h1>, the origin is ${origin}`);
  res.end();
});

io.on('connection', SocketManager);

server.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});

