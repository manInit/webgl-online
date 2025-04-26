export interface WebGLContext {
  readonly canvasElement: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  readonly program: WebGLProgram;
  readonly colorAttributeLocation: number;
  readonly positionAttributeLocation: number;
  readonly positionTextureLocation: number;
  readonly uModelViewMatrixLocation: WebGLUniformLocation;
  readonly uProjectionMatrixLocation: WebGLUniformLocation;
  readonly uUseTextureLocation: WebGLUniformLocation;
}
