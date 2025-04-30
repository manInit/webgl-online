import { mat4, vec3 } from 'gl-matrix';
import { CollisionShape } from '../core/collision/collision-shape.interface';
import { RenderObject } from '../core/environment/render-object.interface';
import { BillboardImage } from '../core/environment/objects/billboard-image';
import { WebGLContext } from '../core/context/webgl-context.interface';

export class TextBubble implements RenderObject {
  readonly modelMatrix = mat4.create();

  readonly MAX_HEIGHT = 0.5;

  readonly SPEED = 0.05;

  readonly DISTANCE_ACTIVATION = 1.5;

  readonly billboardImage: BillboardImage;

  constructor(
    private readonly context: WebGLContext,
    position: vec3,
    readonly author: string,
    readonly text: string,
  ) {
    this.billboardImage = new BillboardImage(
      this.context,
      'text-bubble',
      position,
      1,
      1,
    );
  }

  rotate(angle: number, x: number, y: number, z: number): void {
    this.billboardImage.rotate(angle, x, y, z);
  }

  translate(x: number, y: number, z: number): void {
    this.billboardImage.translate(x, y, z);
  }

  setPosition(x: number, y: number, z: number): void {
    this.billboardImage.setPosition(x, y, z);
  }

  getCollision(): CollisionShape | undefined {
    return this.billboardImage.getCollision();
  }

  render(viewMatrix: mat4): void {
    this.billboardImage.render(viewMatrix);
  }
}
