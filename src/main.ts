import './style.css';

import { initWebGLContext } from './core/context/init-webgl-context';
import { Cube } from './core/environment/figures/cube';
import { World } from './core/environment/world';
import { startApp } from './core/app';

const CANVAS_ID = 'webgl-canvas';
const CANVAS_SELECTOR = `#${CANVAS_ID}`;

const context = initWebGLContext(CANVAS_SELECTOR);
const world = new World([new Cube(context)]);

startApp(context, world);
