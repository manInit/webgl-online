import express from 'express';
import sqlite3 from 'sqlite3';
import { Server } from 'socket.io';
import { randomUUID } from 'crypto';
import { ClientToServerEvents, PlayerMessage, PlayerWithPosition, ServerToClientEvents } from './socket-events.interface';
import { createServer } from './create-server';

const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT,
      user_name TEXT,
      user_id TEXT,
      x REAL NOT NULL,
      y REAL NOT NULL,
      z REAL NOT NULL
    );
  `);
});

function addMessage(message: PlayerMessage): void {
  db.run(
    `INSERT INTO Messages (message, user_name, user_id, x , y, z) VALUES (?, ?, ?, ?, ?, ?);`,
    message.message, message.player.name, message.player.id, message.position[0], message.position[1], message.position[2],
  )
}

async function getAllMessages(): Promise<PlayerMessage[]> {
  return new Promise((resolve, reject) => {
    db.all<{ message: string, user_name: string, user_id: string, x: number, y: number, z: number }>(`SELECT * FROM Messages`, (err, rows) => {
      if (err) {
        reject(err);
      }
      
      const messages = rows.map(row => ({
        message: row.message,
        player: {
          id: row.user_id,
          name: row.user_name
        },
        position: [row.x, row.y, row.z],
      } satisfies PlayerMessage))
      resolve(messages);
    });
  })
}

const app = express();
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.CORS
  }
});

const playersState = new Map<string, PlayerWithPosition>();

io.on('connection', async (socket) => {
  const currentMessages = await getAllMessages();

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
    messages: currentMessages,
  });
  socket.broadcast.emit('playerJoined', playerWithPosition);

  playersState.set(player.id, playerWithPosition);

  socket.on('playerMove', (data) => {
    playersState.set(data.player.id, data);
    socket.broadcast.emit('playerMove', data);
  });

  socket.on('sendMessage', (data) => {
    addMessage(data);
    io.emit('newMessage', data);
  })

  socket.on('disconnect', () => {
    playersState.delete(player.id);

    socket.broadcast.emit('playerDisconnected', player);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});