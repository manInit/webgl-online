export const vertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec3 aColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec3 fColor;

  void main() {
    fColor = aColor;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  varying vec3 fColor;

  void main() {
    gl_FragColor = vec4(fColor, 1.0);
  }
`;
