import { Shaders } from '../shaders/shaders.interface';

export function createWebGLProgram(
  gl: WebGLRenderingContext,
  shaders: Shaders,
): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, shaders.vertexShader);
  gl.attachShader(program, shaders.fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  const log = gl.getProgramInfoLog(program);
  throw new Error(`Create webgl program failed: ${log}`);
}
