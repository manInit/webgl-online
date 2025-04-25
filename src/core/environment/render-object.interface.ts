import { mat4 } from 'gl-matrix';
import { CollisionShape } from '../collision/collision-shape.interface';

export interface RenderObject {
  render(deltaTime: number, viewMatrix: mat4): void;

  rotate(angle: number, x: number, y: number, z: number): void;

  translate(x: number, y: number, z: number): void;

  getCollision(): CollisionShape | undefined;
}
