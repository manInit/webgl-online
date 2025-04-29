/* eslint-disable prettier/prettier */
import { mat4, vec3 } from 'gl-matrix';
import { CollisionShape } from '../../collision/collision-shape.interface';
import { RenderObject } from '../render-object.interface';
import { WebGLContext } from '../../context/webgl-context.interface';
import { gradToRad } from '../../utils/grad-to-rad';
import { TextureNames, Textures } from '../../textures/textures.class';

export class BillboardImage implements RenderObject {
  private readonly modelMatrix = mat4.create();

  private readonly positionBuffer: WebGLBuffer;

  private readonly textureCoordsBuffer: WebGLBuffer;

  constructor(
    private readonly context: WebGLContext,
    private readonly texture: TextureNames,
    position: vec3,
    private readonly width: number,
    private readonly height: number,
  ) {
    const positions = new Float32Array(12);
    const textureCoords = new Float32Array(12);

    const x = 0;
    const y = 0;

    const u1 = 1;
    const v1 = 1;
    const u2 = 0;
    const v2 = 0;

    positions[0] = x;
    positions[1] = y;
    textureCoords[0] = u1;
    textureCoords[1] = v1;

    positions[2] = width;
    positions[3] = y;
    textureCoords[2] = u2;
    textureCoords[3] = v1;

    positions[4] = width;
    positions[5] = height;
    textureCoords[4] = u2;
    textureCoords[5] = v2;

    positions[6] = x;
    positions[7] = height;
    textureCoords[6] = u1;
    textureCoords[7] = v2;

    positions[8] = x;
    positions[9] = y;
    textureCoords[8] = u1;
    textureCoords[9] = v1;

    positions[10] = width;
    positions[11] = height;
    textureCoords[10] = u2;
    textureCoords[11] = v2;

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

    mat4.translate(this.modelMatrix, this.modelMatrix, position);
  }

  rotate(angle: number, x: number, y: number, z: number): void {
    const rad = gradToRad(angle);
    mat4.rotate(
      this.modelMatrix,
      this.modelMatrix,
      rad,
      vec3.normalize(vec3.create(), [x, y, z]),
    );
  }

  translate(x: number, y: number, z: number): void {
    const newCenter = vec3.fromValues(x, y, z);
    mat4.translate(this.modelMatrix, this.modelMatrix, newCenter);
  }

  setPosition(x: number, y: number, z: number): void {
    this.modelMatrix[12] = x;
    this.modelMatrix[13] = y;
    this.modelMatrix[14] = z;
  }

  getCollision(): CollisionShape | undefined {
    return;
  }

  render(deltaTime: number, viewMatrix: mat4): void {
    this.context.gl.uniform1i(this.context.uUseTextureLocation, 1);
    this.context.gl.bindTexture(
      this.context.gl.TEXTURE_2D,
      Textures.getTexture(this.texture),
    );

    const up = vec3.fromValues(0, 1, 0);
    const invert = mat4.create();
    mat4.invert(invert, viewMatrix);
    const cameraDirection = vec3.fromValues(invert[2], 0, invert[10]);
    vec3.normalize(cameraDirection, cameraDirection);
    const right = vec3.create();
    vec3.cross(right, up, cameraDirection);
    vec3.normalize(right, right);

    const rotationMatrix = mat4.create();
    mat4.set(
      rotationMatrix,
      right[0], up[0], cameraDirection[0], 0,
      right[1], up[1], cameraDirection[1], 0,
      right[2], up[2], cameraDirection[2], 0,
      0, 0, 0, 1
    );

    const finalModelMatrix = mat4.create();
    mat4.translate(finalModelMatrix, finalModelMatrix, vec3.fromValues(0, this.height / 2, 0));
    mat4.multiply(finalModelMatrix, finalModelMatrix, this.modelMatrix);
    mat4.multiply(finalModelMatrix, finalModelMatrix, rotationMatrix);
    mat4.translate(finalModelMatrix, finalModelMatrix, vec3.fromValues(-this.width / 2, -this.height / 2, 0));

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, finalModelMatrix);
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
      6,
    );
    this.context.gl.bindTexture(this.context.gl.TEXTURE_2D, null);
  }
}
