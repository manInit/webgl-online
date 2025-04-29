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

export class ServerSocket {
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  private player: Player | undefined;

  private readonly anotherPlayers = new Map<
    string,
    {
      player: Player;
      object: RenderObject;
    }
  >();

  get playersObject(): RenderObject[] {
    return Array.from(this.anotherPlayers.values()).map((o) => o.object);
  }

  constructor(url: string, context: WebGLContext) {
    this.socket = io(url);

    this.socket.on('createUser', (players) => {
      this.player = players.player;

      players.otherPlayers.forEach((player) => {
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
}
