import './style.css';

import { initWebGLContext } from './core/context/init-webgl-context';
import { startApp } from './core/app';
import { createChessWorld } from './chess-room.world';
import { TextInputManager } from './game-objects/text-input-manager';
import { vec3 } from 'gl-matrix';
import { chatDisplayCallback } from './game-objects/chat-display-callback';
import { GlobalSettings } from './core/app.interface';
import { createInputBubbleCallback } from './game-objects/input-bubble-callback';

const CANVAS_ID = 'webgl-canvas';
const CANVAS_SELECTOR = `#${CANVAS_ID}`;

const context = initWebGLContext(CANVAS_SELECTOR);

const chessWorld = createChessWorld(context);

const globalSettings: GlobalSettings = {
  cameraPosition: vec3.fromValues(0, 1.73, 0),
};

const manager = new TextInputManager(context, chessWorld);
manager.listenKeyPress('KeyT', 'ControlLeft');

startApp(context, globalSettings, chessWorld, import.meta.env.VITE_SERVER_URL, [
  chatDisplayCallback,
  createInputBubbleCallback(manager),
]);
