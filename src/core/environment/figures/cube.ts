/* eslint-disable prettier/prettier */
import { mat4, vec3 } from 'gl-matrix';
import { WebGLContext } from '../../context/webgl-context.interface';
import { RenderObject } from '../render-object.interface';
import { gradToRad } from '../../utils/grad-to-rad';

export class Cube implements RenderObject {
  private readonly modelMatrix = mat4.create();

  private readonly center = vec3.create();

  private readonly positionBuffer: WebGLBuffer;

  private readonly colorBuffer: WebGLBuffer;

  private readonly indicesBuffer: WebGLBuffer;

  constructor(
    private readonly context: WebGLContext,
    readonly startPosition: vec3,
    private readonly size: vec3,
    private readonly color: vec3,
  ) {
    this.positionBuffer = this.context.gl.createBuffer();
    this.context.gl.bindBuffer(
      this.context.gl.ARRAY_BUFFER,
      this.positionBuffer,
    );

    const [halfWidth, halfHeight, halfDepth] = [
      this.size[0] / 2,
      this.size[1] / 2,
      this.size[2] / 2
    ];
    const positions = new Float32Array([
     -halfWidth, -halfHeight,  halfDepth,
     halfWidth, -halfHeight,  halfDepth,
     halfWidth,  halfHeight,  halfDepth,
     -halfWidth,  halfHeight,  halfDepth,
     -halfWidth, -halfHeight, -halfDepth,
     halfWidth, -halfHeight, -halfDepth,
     halfWidth,  halfHeight, -halfDepth,
     -halfWidth,  halfHeight, -halfDepth,
    ]);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.startPosition);
    vec3.copy(this.center, this.startPosition);

    this.context.gl.bufferData(
      this.context.gl.ARRAY_BUFFER,
      positions,
      this.context.gl.STATIC_DRAW,
    );

    this.colorBuffer = this.context.gl.createBuffer();
    this.context.gl.bindBuffer(this.context.gl.ARRAY_BUFFER, this.colorBuffer);
    const colors = new Float32Array([
      ...this.color,
      ...this.color,
      ...this.color,
      ...this.color,
      ...this.color,
      ...this.color,
      ...this.color,
      ...this.color,
    ]);
    this.context.gl.bufferData(
      this.context.gl.ARRAY_BUFFER,
      colors,
      this.context.gl.STATIC_DRAW,
    );

    this.indicesBuffer = this.context.gl.createBuffer();
    const indices = new Uint16Array([
      // Front face
      0, 1, 2,
      0, 2, 3,
      // Back face
      4, 6, 5,
      4, 7, 6,
      // Top face
      3, 2, 6,
      3, 6, 7,
      // Bottom face
      0, 5, 1,
      0, 4, 5,
      // Right face
      1, 5, 6,
      1, 6, 2,
      // Left face
      0, 3, 7,
      0, 7, 4,
    ]);
    this.context.gl.bindBuffer(this.context.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    this.context.gl.bufferData(
      this.context.gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this.context.gl.STATIC_DRAW,
    );
  }

  rotate(angle: number, x: number, y: number, z: number): void {
    const rad = gradToRad(angle);
    mat4.rotate(this.modelMatrix, this.modelMatrix, rad, vec3.normalize(vec3.create(), [x, y, z]));
  }

  translate(x: number, y: number, z: number): void {
    mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(x, y, z));
  }

  render(_: number, viewMatrix: mat4): void {
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
      3,
      this.context.gl.FLOAT,
      false,
      0,
      0,
    );

    this.context.gl.enableVertexAttribArray(
      this.context.colorAttributeLocation,
    );
    this.context.gl.bindBuffer(this.context.gl.ARRAY_BUFFER, this.colorBuffer);
    this.context.gl.vertexAttribPointer(
      this.context.colorAttributeLocation,
      3,
      this.context.gl.FLOAT,
      false,
      0,
      0,
    );

    this.context.gl.bindBuffer(this.context.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    this.context.gl.drawElements(this.context.gl.TRIANGLES, 36, this.context.gl.UNSIGNED_SHORT, 0);
  }
}
