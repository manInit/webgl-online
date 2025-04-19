import { fragmentShaderSource, vertexShaderSource } from './shader-sources';
import { Shaders } from './shaders.interface';

function createShader(
  gl: WebGLRenderingContext,
  shaderType: GLenum,
  source: string,
): WebGLShader {
  const shader = gl.createShader(shaderType);
  if (!shader) {
    throw new Error(`Can't create shader for type: ${shaderType}`);
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  const log = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(`Shader compilation failed: ${log}`);
}

export function initShaders(gl: WebGLRenderingContext): Shaders {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  return {
    fragmentShader,
    vertexShader,
  };
}
