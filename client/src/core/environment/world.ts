import { mat4 } from 'gl-matrix';
import { RenderObject } from './render-object.interface';
import { CollisionShape } from '../collision/collision-shape.interface';

export class World implements RenderObject {
  readonly modelMatrix = mat4.create();

  constructor(private objects: RenderObject[]) {}

  getCollision(): CollisionShape | undefined {
    // world don't have collision itself
    return;
  }

  getObjects(): RenderObject[] {
    return this.objects;
  }

  addObject(object: RenderObject): void {
    this.objects.push(object);
  }

  removeObject(targetObject: RenderObject): void {
    this.objects = this.objects.filter((object) => object !== targetObject);
  }

  translate(x: number, y: number, z: number): void {
    this.objects.forEach((object) => {
      object.translate(x, y, z);
    });
  }

  setPosition(): void {}

  rotate(angle: number, x: number, y: number, z: number): void {
    this.objects.forEach((object) => {
      object.rotate(angle, x, y, z);
    });
  }

  render(viewMatrix: mat4): void {
    this.objects.forEach((object) => {
      object.render(viewMatrix);
    });
  }
}
