import { mat4, vec3 } from 'gl-matrix';
import { gradToRad } from './utils/grad-to-rad';
import { WebGLContext } from './context/webgl-context.interface';
import {
  KEY_BACKWARD,
  KEY_FORWARD,
  KEY_LEFT,
  KEY_RIGHT,
  MOUSE_SENSITIVITY,
  SPEED_MOVE,
} from './config';

export class Camera {
  private readonly viewMatrix = mat4.create();

  private position = vec3.fromValues(0, 1.73, 0);
  private pointToLook = vec3.fromValues(0, 0, -1);
  private up = vec3.fromValues(0, 1, 0);

  private horizontalAngle = -90;
  private verticalAngle = 0;

  private pressedKeys = new Set();

  constructor(
    context: WebGLContext,
    withControls: boolean,
    private readonly freeMode: boolean,
  ) {
    if (withControls) {
      document.addEventListener('keydown', (e) => this.pressedKeys.add(e.code));
      document.addEventListener('keyup', (e) =>
        this.pressedKeys.delete(e.code),
      );

      context.canvasElement.addEventListener('click', () => {
        context.canvasElement.requestPointerLock();
      });
      document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement !== context.canvasElement) {
          return;
        }

        const dx = e.movementX;
        const dy = e.movementY;
        this.rotate(dx * MOUSE_SENSITIVITY, -dy * MOUSE_SENSITIVITY);
      });
    }
  }

  private updateForwardVector(): void {
    const horizontalAngle = gradToRad(this.horizontalAngle);
    const verticalAngle = gradToRad(this.verticalAngle);

    this.pointToLook[0] = Math.cos(verticalAngle) * Math.cos(horizontalAngle);
    this.pointToLook[1] = Math.sin(verticalAngle);
    this.pointToLook[2] = Math.cos(verticalAngle) * Math.sin(horizontalAngle);
  }

  moveForwardOrBackward(back = false): void {
    let moveDirection: vec3;
    if (!this.freeMode) {
      moveDirection = vec3.clone(this.pointToLook);
      moveDirection[1] = 0;
      vec3.normalize(moveDirection, moveDirection);
    } else {
      moveDirection = this.pointToLook;
    }

    vec3.scaleAndAdd(
      this.position,
      this.position,
      moveDirection,
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
    if (this.pressedKeys.has(KEY_RIGHT)) {
      this.moveRightOrLeft(false);
    }
    if (this.pressedKeys.has(KEY_LEFT)) {
      this.moveRightOrLeft(true);
    }
    if (this.pressedKeys.has(KEY_FORWARD)) {
      this.moveForwardOrBackward(false);
    }
    if (this.pressedKeys.has(KEY_BACKWARD)) {
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
