import { mat4, vec3 } from 'gl-matrix';
import { gradToRad } from './utils/grad-to-rad';

const SPEED_MOVE = 0.1;

export class Camera {
  private readonly viewMatrix = mat4.create();

  private position = vec3.fromValues(0, 0, 0);
  private pointToLook = vec3.fromValues(0, 0, -1);
  private up = vec3.fromValues(0, 1, 0);

  private horizontalAngle = -90;
  private verticalAngle = 0;

  private pressedKeys = new Set();

  constructor(withControls: boolean) {
    if (withControls) {
      document.addEventListener('keydown', (e) => this.pressedKeys.add(e.code));
      document.addEventListener('keyup', (e) =>
        this.pressedKeys.delete(e.code),
      );
    }
  }

  private updateForwardVector(): void {
    const horizontalAngle = gradToRad(this.horizontalAngle);
    const verticalAngle = gradToRad(this.verticalAngle);

    this.pointToLook[0] = Math.cos(verticalAngle) * Math.cos(horizontalAngle);
    this.pointToLook[1] = Math.sin(verticalAngle);
    this.pointToLook[2] = Math.cos(verticalAngle) * Math.sin(horizontalAngle);
    vec3.normalize(this.pointToLook, this.pointToLook);
  }

  moveForwardOrBackward(back = false): void {
    vec3.scaleAndAdd(
      this.position,
      this.position,
      this.pointToLook,
      back ? -SPEED_MOVE : SPEED_MOVE,
    );
  }

  moveRightOrLeft(isRight = false): void {
    const right = vec3.create();
    vec3.cross(right, this.pointToLook, this.up);
    vec3.normalize(right, right);

    vec3.scaleAndAdd(
      this.position,
      this.position,
      right,
      isRight ? -SPEED_MOVE : SPEED_MOVE,
    );
  }

  checkUpdate(): void {
    if (this.pressedKeys.has('KeyD')) {
      this.moveRightOrLeft(false);
    }
    if (this.pressedKeys.has('KeyA')) {
      this.moveRightOrLeft(true);
    }
    if (this.pressedKeys.has('KeyW')) {
      this.moveForwardOrBackward(false);
    }
    if (this.pressedKeys.has('KeyS')) {
      this.moveForwardOrBackward(true);
    }
  }

  rotate(horizontalAngle: number, verticalAngle: number): void {
    this.horizontalAngle += horizontalAngle;
    this.verticalAngle += verticalAngle;

    this.verticalAngle = Math.max(-89, Math.min(89, this.verticalAngle));

    this.updateForwardVector();
  }

  getViewMatrix(): mat4 {
    const target = vec3.create();
    vec3.add(target, this.position, this.pointToLook);
    mat4.lookAt(this.viewMatrix, this.position, target, this.up);
    return this.viewMatrix;
  }
}
