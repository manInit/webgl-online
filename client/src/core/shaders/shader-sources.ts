export const vertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec3 fColor;
  varying vec2 fTexCoord;

  void main() {
    fColor = aColor;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    fTexCoord = aTexCoord;
  }
`;

export const fragmentShaderSource = `
  precision mediump float;

  varying vec3 fColor;
  varying vec2 fTexCoord;

  uniform sampler2D uTexture;
  uniform bool uUseTexture;

  void main() {
    if (uUseTexture) {
      gl_FragColor = texture2D(uTexture, fTexCoord);
    } else {
      gl_FragColor = vec4(fColor, 1.0);
    }
  }
`;
