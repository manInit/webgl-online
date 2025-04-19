import { mat4 } from 'gl-matrix';
import { RenderObject } from './render-object.interface';

export class World implements RenderObject {
  constructor(private objects: RenderObject[]) {}

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

  rotate(angle: number, x: number, y: number, z: number): void {
    this.objects.forEach((object) => {
      object.rotate(angle, x, y, z);
    });
  }

  render(deltaTime: number, viewMatrix: mat4): void {
    this.objects.forEach((object) => {
      object.render(deltaTime, viewMatrix);
    });
  }
}
