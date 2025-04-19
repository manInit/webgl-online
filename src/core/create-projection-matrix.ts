import { mat4 } from 'gl-matrix';
import { WebGLContext } from './context/webgl-context.interface';
import { gradToRad } from './utils/grad-to-rad';

const FOV = 45;
const NEAR = 0.1;
const FAR = 100;

export function createProjectionMatrix(context: WebGLContext): mat4 {
  const projectionMatrix = mat4.create();

  const fov = gradToRad(FOV);
  const aspect =
    context.canvasElement.clientWidth / context.canvasElement.clientHeight;
  mat4.perspective(projectionMatrix, fov, aspect, NEAR, FAR);
  return projectionMatrix;
}
