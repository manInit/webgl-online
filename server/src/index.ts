import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { randomUUID } from 'crypto';
import { ClientToServerEvents, PlayerWithPosition, ServerToClientEvents } from './socket-events.interface';

process.env.USER_ID;

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: '*'
  }
});


const playersState = new Map<string, PlayerWithPosition>();

io.on('connection', (socket) => {
  const player = {
    id: randomUUID(),
    name: `test-${Math.floor(Math.random() * 10)}`,
  }
  const startPosition: [number, number, number] = [0, 1.73, 0];
  const playerWithPosition: PlayerWithPosition = {
      player,
      position: startPosition,
  }

  socket.emit('createUser', {
    player,
    otherPlayers: Array.from(playersState.values()),
  });
  socket.broadcast.emit('playerJoined', playerWithPosition);

  playersState.set(player.id, playerWithPosition);

  socket.on('playerMove', (data) => {
    playersState.set(data.player.id, data);
    socket.broadcast.emit('playerMove', data);
  });

  socket.on('disconnect', () => {
    playersState.delete(player.id);

    socket.broadcast.emit('playerDisconnected', player);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});