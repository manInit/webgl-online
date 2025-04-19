export interface WebGLContext {
  canvasElement: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  colorAttributeLocation: number;
  positionAttributeLocation: number;
  uModelViewMatrixLocation: WebGLUniformLocation;
  uProjectionMatrixLocation: WebGLUniformLocation;
}
