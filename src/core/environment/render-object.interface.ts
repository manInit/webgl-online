import { mat4 } from 'gl-matrix';

export interface RenderObject {
  render(deltaTime: number, viewMatrix: mat4): void;

  rotate(angle: number, x: number, y: number, z: number): void;

  translate(x: number, y: number, z: number): void;
}
