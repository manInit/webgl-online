import { vec3, mat4 } from 'gl-matrix';
import { World } from './environment/world';
import { Player } from './network/socket-events.interface';
import { ServerSocket } from './network/server-socket';

export interface GlobalSettings {
  cameraPosition: vec3;
}

export interface MutableState {
  readonly controlsEnabled: boolean;
}

export interface PlayerState {
  player: Player | undefined;
  position: vec3;
}

export interface RenderCallbackParams {
  readonly viewMatrix: mat4;
  readonly playerState: PlayerState;
  readonly world: World;
  readonly state: MutableState;
  readonly setState: (state: MutableState) => void;
  readonly socket: ServerSocket;
}

export type RenderCallback = (params: RenderCallbackParams) => void;
