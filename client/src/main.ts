import './style.css';

import { initWebGLContext } from './core/context/init-webgl-context';
import { startApp } from './core/app';
import { createChessWorld } from './chess-room.world';

const CANVAS_ID = 'webgl-canvas';
const CANVAS_SELECTOR = `#${CANVAS_ID}`;

const context = initWebGLContext(CANVAS_SELECTOR);

const chessWorld = createChessWorld(context);

startApp(context, chessWorld, import.meta.env.VITE_SERVER_URL);
