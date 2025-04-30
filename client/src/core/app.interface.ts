import { vec3, mat4 } from 'gl-matrix';
import { World } from './environment/world';
import { Player } from './network/socket-events.interface';
import { ServerSocket } from './network/server-socket';

export interface GlobalSettings {
  cameraPosition: vec3;
}

export interface MutableState {
  controlsEnabled: boolean;
}

export interface PlayerState {
  player: Player | undefined;
  position: vec3;
}

export interface RenderCallbackParams {
  viewMatrix: mat4;
  playerState: PlayerState;
  world: World;
  state: MutableState;
  socket: ServerSocket;
}

export type RenderCallback = (params: RenderCallbackParams) => void;
