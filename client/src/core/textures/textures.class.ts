import { WebGLContext } from '../context/webgl-context.interface';
import { createFontTextureFromPng } from './create-texture-from-png';

export type TextureNames = 'fonts' | 'character' | 'text-bubble';

export class Textures {
  static texturesMap = new Map<TextureNames, WebGLTexture>();

  static getTexture(name: TextureNames): WebGLTexture {
    if (!Textures.texturesMap.has(name)) {
      throw new Error(`Texture ${name} not loaded`);
    }
    return Textures.texturesMap.get(name)!;
  }

  static createTextures(context: WebGLContext): void {
    const fontTexture = createFontTextureFromPng(context, 'public/font.png');
    Textures.texturesMap.set('fonts', fontTexture);

    const heroTexture = createFontTextureFromPng(
      context,
      'public/character.png',
    );
    Textures.texturesMap.set('character', heroTexture);

    const textBubbleTexture = createFontTextureFromPng(
      context,
      'public/text-bubble.png',
    );
    Textures.texturesMap.set('text-bubble', textBubbleTexture);
  }
}
