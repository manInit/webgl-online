import { WebGLContext } from '../context/webgl-context.interface';
import { createFontTexture } from '../fonts/create-font-texture';

type TextureNames = 'fonts';

export class Textures {
  static texturesMap = new Map<TextureNames, WebGLTexture>();

  static getTexture(name: TextureNames): WebGLTexture {
    if (!Textures.texturesMap.has(name)) {
      throw new Error(`Texture ${name} not loaded`);
    }
    return Textures.texturesMap.get(name)!;
  }

  static createTextures(context: WebGLContext): void {
    const texture = createFontTexture(context);
    Textures.texturesMap.set('fonts', texture);
  }
}
