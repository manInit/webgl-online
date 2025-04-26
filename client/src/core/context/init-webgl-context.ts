import { canvasInit } from './canvas-init';
import { WebGLContext } from './webgl-context.interface';
import { createWebGLProgram } from './create-webgl-program';
import { initShaders } from '../shaders/init-shaders';

export function initWebGLContext(canvasSelector: string): WebGLContext {
  const canvasElement = canvasInit(canvasSelector);
  const gl = canvasElement.getContext('webgl');
  if (!gl) {
    throw new Error(`WebGL context not created`);
  }

  const shaders = initShaders(gl);
  const program = createWebGLProgram(gl, shaders);

  const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
  const colorAttributeLocation = gl.getAttribLocation(program, 'aColor');
  const positionTextureLocation = gl.getAttribLocation(program, 'aTexCoord');
  const uModelViewMatrixLocation = gl.getUniformLocation(
    program,
    'uModelViewMatrix',
  );
  if (!uModelViewMatrixLocation) {
    throw new Error('Location for uModelViewMatrixLocation not found');
  }

  const uProjectionMatrixLocation = gl.getUniformLocation(
    program,
    'uProjectionMatrix',
  );
  if (!uProjectionMatrixLocation) {
    throw new Error('Location for uProjectionMatrixLocation not found');
  }

  const uUseTextureLocation = gl.getUniformLocation(program, 'uUseTexture');
  if (!uUseTextureLocation) {
    throw new Error('Location for uUseTextureLocation not found');
  }

  return {
    gl,
    program,
    canvasElement,
    colorAttributeLocation,
    uModelViewMatrixLocation,
    positionAttributeLocation,
    uProjectionMatrixLocation,
    positionTextureLocation,
    uUseTextureLocation,
  };
}
