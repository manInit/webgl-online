import { mat4, vec3 } from 'gl-matrix';
import { CollisionShape } from '../../collision/collision-shape.interface';
import { RenderObject } from '../render-object.interface';
import { FONT_INFO } from '../../fonts/font-info';
import { WebGLContext } from '../../context/webgl-context.interface';
import { Textures } from '../../textures/textures.class';

export class TextObject implements RenderObject {
  private readonly modelMatrix = mat4.create();

  private readonly positionBuffer: WebGLBuffer;

  private readonly textureCoordsBuffer: WebGLBuffer;

  get msgText(): string {
    return this.text;
  }

  constructor(
    private readonly context: WebGLContext,
    private readonly text: string,
  ) {
    const verticesCount = text.length * 6;

    const positions = new Float32Array(verticesCount * 2);
    const textureCoords = new Float32Array(verticesCount * 2);

    const maxX = FONT_INFO.textureWidth;
    const maxY = FONT_INFO.textureHeight;

    let x = 0;
    let offset = 0;

    for (let i = 0; i < text.length; i++) {
      const letter = text[i];
      const letterInfo = FONT_INFO.glyphInfos[letter];
      if (!letterInfo) {
        x += FONT_INFO.spaceWidth;
        continue;
      }

      const x2 = x + letterInfo.width;

      const u1 = letterInfo.x / maxX;
      const v1 = (letterInfo.y + FONT_INFO.letterHeight - 1) / maxY;
      const u2 = (letterInfo.x + letterInfo.width - 1) / maxX;
      const v2 = letterInfo.y / maxY;

      positions[offset + 0] = x;
      positions[offset + 1] = 0;
      textureCoords[offset + 0] = u1;
      textureCoords[offset + 1] = v1;

      positions[offset + 2] = x2;
      positions[offset + 3] = 0;
      textureCoords[offset + 2] = u2;
      textureCoords[offset + 3] = v1;

      positions[offset + 4] = x;
      positions[offset + 5] = FONT_INFO.letterHeight;
      textureCoords[offset + 4] = u1;
      textureCoords[offset + 5] = v2;

      positions[offset + 6] = x;
      positions[offset + 7] = FONT_INFO.letterHeight;
      textureCoords[offset + 6] = u1;
      textureCoords[offset + 7] = v2;

      positions[offset + 8] = x2;
      positions[offset + 9] = 0;
      textureCoords[offset + 8] = u2;
      textureCoords[offset + 9] = v1;

      positions[offset + 10] = x2;
      positions[offset + 11] = FONT_INFO.letterHeight;
      textureCoords[offset + 10] = u2;
      textureCoords[offset + 11] = v2;

      x += letterInfo.width + FONT_INFO.spacing;
      offset += 12;
    }

    this.positionBuffer = this.context.gl.createBuffer();
    this.context.gl.bindBuffer(
      this.context.gl.ARRAY_BUFFER,
      this.positionBuffer,
    );
    this.context.gl.bufferData(
      this.context.gl.ARRAY_BUFFER,
      positions,
      this.context.gl.STATIC_DRAW,
    );

    this.textureCoordsBuffer = this.context.gl.createBuffer();
    this.context.gl.bindBuffer(
      this.context.gl.ARRAY_BUFFER,
      this.textureCoordsBuffer,
    );
    this.context.gl.bufferData(
      this.context.gl.ARRAY_BUFFER,
      textureCoords,
      this.context.gl.STATIC_DRAW,
    );

    mat4.translate(
      this.modelMatrix,
      this.modelMatrix,
      vec3.fromValues(1, 2, 1),
    );
    mat4.scale(
      this.modelMatrix,
      this.modelMatrix,
      vec3.fromValues(0.01, 0.01, 0.01),
    );
  }

  rotate(): void {
    throw new Error('Method not implemented.');
  }

  translate(): void {
    throw new Error('Method not implemented.');
  }

  setPosition(): void {
    throw new Error('Method not implemented.');
  }

  getCollision(): CollisionShape | undefined {
    return;
  }

  render(_: number, viewMatrix: mat4): void {
    this.context.gl.uniform1i(this.context.uUseTextureLocation, 1);
    this.context.gl.bindTexture(
      this.context.gl.TEXTURE_2D,
      Textures.getTexture('fonts'),
    );

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, this.modelMatrix);
    this.context.gl.uniformMatrix4fv(
      this.context.uModelViewMatrixLocation,
      false,
      modelViewMatrix,
    );

    this.context.gl.enableVertexAttribArray(
      this.context.positionAttributeLocation,
    );
    this.context.gl.bindBuffer(
      this.context.gl.ARRAY_BUFFER,
      this.positionBuffer,
    );
    this.context.gl.vertexAttribPointer(
      this.context.positionAttributeLocation,
      2,
      this.context.gl.FLOAT,
      false,
      0,
      0,
    );

    this.context.gl.enableVertexAttribArray(
      this.context.positionTextureLocation,
    );
    this.context.gl.bindBuffer(
      this.context.gl.ARRAY_BUFFER,
      this.textureCoordsBuffer,
    );
    this.context.gl.vertexAttribPointer(
      this.context.positionTextureLocation,
      2,
      this.context.gl.FLOAT,
      false,
      0,
      0,
    );

    this.context.gl.drawArrays(
      this.context.gl.TRIANGLES,
      0,
      this.text.length * 6,
    );
    this.context.gl.bindTexture(this.context.gl.TEXTURE_2D, null);
  }
}
