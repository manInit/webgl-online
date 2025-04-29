import { WebGLContext } from '../context/webgl-context.interface';

export function createFontTextureFromPng(
  context: WebGLContext,
  imagePath: string,
): WebGLTexture {
  const texture = context.gl.createTexture();
  context.gl.bindTexture(context.gl.TEXTURE_2D, texture);
  context.gl.texImage2D(
    context.gl.TEXTURE_2D,
    0,
    context.gl.RGBA,
    1,
    1,
    0,
    context.gl.RGBA,
    context.gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255]),
  );

  const image = new Image();
  image.src = imagePath;
  image.addEventListener('load', () => {
    context.gl.bindTexture(context.gl.TEXTURE_2D, texture);
    context.gl.pixelStorei(context.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    context.gl.texImage2D(
      context.gl.TEXTURE_2D,
      0,
      context.gl.RGBA,
      context.gl.RGBA,
      context.gl.UNSIGNED_BYTE,
      image,
    );
    context.gl.texParameteri(
      context.gl.TEXTURE_2D,
      context.gl.TEXTURE_WRAP_S,
      context.gl.CLAMP_TO_EDGE,
    );
    context.gl.texParameteri(
      context.gl.TEXTURE_2D,
      context.gl.TEXTURE_WRAP_T,
      context.gl.CLAMP_TO_EDGE,
    );
    context.gl.texParameteri(
      context.gl.TEXTURE_2D,
      context.gl.TEXTURE_MIN_FILTER,
      context.gl.NEAREST,
    );
    context.gl.texParameteri(
      context.gl.TEXTURE_2D,
      context.gl.TEXTURE_MAG_FILTER,
      context.gl.NEAREST,
    );
  });
  context.gl.bindTexture(context.gl.TEXTURE_2D, null);

  return texture;
}
