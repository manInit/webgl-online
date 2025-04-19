/* eslint-disable prettier/prettier */
import { mat4, vec3 } from 'gl-matrix';
import { WebGLContext } from '../../context/webgl-context.interface';
import { RenderObject } from '../render-object.interface';

export class Cube implements RenderObject {
  private readonly modelMatrix = mat4.create();

  private readonly positionBuffer: WebGLBuffer;

  private readonly colorBuffer: WebGLBuffer;

  private readonly indicesBuffer: WebGLBuffer;

  constructor(private readonly context: WebGLContext) {
    this.positionBuffer = this.context.gl.createBuffer();
    this.context.gl.bindBuffer(
      this.context.gl.ARRAY_BUFFER,
      this.positionBuffer,
    );
    const positions = new Float32Array([
      -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
      -1, 1, 1,
    ]);
    this.context.gl.bufferData(
      this.context.gl.ARRAY_BUFFER,
      positions,
      this.context.gl.STATIC_DRAW,
    );

    this.colorBuffer = this.context.gl.createBuffer();
    this.context.gl.bindBuffer(this.context.gl.ARRAY_BUFFER, this.colorBuffer);
    const colors = new Float32Array([
      1, 0, 0, // red
      0, 1, 0, // green
      0, 0, 1, // blue
      1, 1, 0, // yellow
      1, 0, 1, // magenta
      0, 1, 1, // cyan
      1, 1, 1, // white
      0, 0, 0  // black
    ]);
    this.context.gl.bufferData(
      this.context.gl.ARRAY_BUFFER,
      colors,
      this.context.gl.STATIC_DRAW,
    );

    this.indicesBuffer = this.context.gl.createBuffer();
    const indices = new Uint16Array([
      0, 1, 2, 2, 3, 0,   // back
      4, 5, 6, 6, 7, 4,   // front
      0, 4, 7, 7, 3, 0,   // left
      1, 5, 6, 6, 2, 1,   // right
      3, 2, 6, 6, 7, 3,   // top
      0, 1, 5, 5, 4, 0    // bottom
    ]);
    this.context.gl.bindBuffer(this.context.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    this.context.gl.bufferData(
      this.context.gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this.context.gl.STATIC_DRAW,
    );
  }

  rotate(angle: number, x: number, y: number, z: number): void {
    mat4.rotate(this.modelMatrix, this.modelMatrix, angle, vec3.fromValues(x, y, z));
  }

  translate(x: number, y: number, z: number): void {
    mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(x, y, z));
  }

  update(): void {}

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
