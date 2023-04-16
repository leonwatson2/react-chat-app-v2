import express from 'express'
import { Server } from "socket.io";
import { createServer } from 'http';
import { SocketManager } from './socketManager.js'

const app = express()

const PORT = process.env.PORT || 3000

const server = createServer(app);


export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://vlw2.com"]
  }
});
app.get('/', (req, res) => {
  res.write(`<h1>Server is running on port ${PORT}</h1>`);
  res.end();
});

io.on('connection', SocketManager);

server.listen(PORT, function () {
  console.log('listening on *:' + PORT);
});

