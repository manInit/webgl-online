import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  Player,
  ServerToClientEvents,
} from './socket-events.interface';
import { vec3 } from 'gl-matrix';
import { RenderObject } from '../environment/render-object.interface';
import { Cube } from '../environment/objects/cube';
import { WebGLContext } from '../context/webgl-context.interface';
import { TextBubble } from '../../game-objects/text-bubble';

export class ServerSocket {
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  player: Player | undefined;

  private readonly anotherPlayers = new Map<
    string,
    {
      player: Player;
      object: RenderObject;
    }
  >();

  private readonly bubbles: TextBubble[] = [];

  get playersObject(): RenderObject[] {
    return Array.from(this.anotherPlayers.values()).map((o) => o.object);
  }

  get bubblesObject(): TextBubble[] {
    return this.bubbles;
  }

  constructor(url: string, context: WebGLContext) {
    this.socket = io(url);

    this.socket.on('createUser', (data) => {
      this.player = data.player;

      data.otherPlayers.forEach((player) => {
        this.anotherPlayers.set(player.player.id, {
          player: player.player,
          object: new Cube(
            context,
            vec3.fromValues(
              player.position[0],
              player.position[1],
              player.position[2],
            ),
            vec3.fromValues(0.5, 0.5, 0.5),
            vec3.fromValues(1, 0, 0),
          ),
        });
      });
      data.messages.forEach((msg) => {
        const bubble = new TextBubble(
          context,
          vec3.fromValues(msg.position[0], msg.position[1], msg.position[2]),
          msg.player.name,
          msg.message,
        );
        this.bubbles.push(bubble);
      });
    });

    this.socket.on('playerJoined', (data) => {
      this.anotherPlayers.set(data.player.id, {
        player: data.player,
        object: new Cube(
          context,
          vec3.fromValues(data.position[0], data.position[1], data.position[2]),
          vec3.fromValues(0.5, 0.5, 0.5),
          vec3.fromValues(1, 0, 0),
        ),
      });
    });

    this.socket.on('playerDisconnected', (data) => {
      this.anotherPlayers.delete(data.id);
    });

    this.socket.on('playerMove', (data) => {
      const object = this.anotherPlayers.get(data.player.id);
      object?.object.setPosition(
        data.position[0],
        data.position[1],
        data.position[2],
      );
    });

    this.socket.on('newMessage', (data) => {
      const bubble = new TextBubble(
        context,
        vec3.fromValues(data.position[0], data.position[1], data.position[2]),
        data.player.name,
        data.message,
      );
      this.bubbles.push(bubble);
    });
  }

  emitPlayerMove(coord: vec3): void {
    if (!this.player) {
      return;
    }

    this.socket.emit('playerMove', {
      player: this.player,
      position: [coord[0], coord[1], coord[2]],
    });
  }

  emitPlayerMessage(message: string, position: vec3): void {
    if (!this.player) {
      return;
    }

    this.socket.emit('sendMessage', {
      player: this.player,
      message,
      position: [position[0], position[1], position[2]],
    });
  }
}
