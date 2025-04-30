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
import { CollisionShape } from './collision/collision-shape.interface';

export class Camera {
  private readonly viewMatrix = mat4.create();

  private readonly position: vec3;
  private readonly pointToLook = vec3.fromValues(0, 0, -1);
  private readonly up = vec3.fromValues(0, 1, 0);
  private readonly collisionShapeSize = vec3.fromValues(0.5, 0.5, 0.5);

  private horizontalAngle = -90;
  private verticalAngle = 0;

  private readonly pressedKeys = new Set();

  get currentPosition(): vec3 {
    return this.position;
  }

  set currentPosition(position: vec3) {
    vec3.copy(this.position, position);
  }

  constructor(
    context: WebGLContext,
    startPosition: vec3,
    withControls: boolean,
    private readonly freeMode: boolean,
  ) {
    this.position = vec3.clone(startPosition);
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

  getCollisionShape(): CollisionShape {
    return {
      minX: this.position[0] - this.collisionShapeSize[0] / 2,
      maxX: this.position[0] + this.collisionShapeSize[0] / 2,
      minY: this.position[1] - this.collisionShapeSize[1] / 2,
      maxY: this.position[1] + this.collisionShapeSize[1] / 2,
      minZ: this.position[2] - this.collisionShapeSize[2] / 2,
      maxZ: this.position[2] + this.collisionShapeSize[2] / 2,
    } satisfies CollisionShape;
  }

  moveForwardOrBackward(back: boolean, deltaTime: number): void {
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
      back ? -SPEED_MOVE * deltaTime : SPEED_MOVE * deltaTime,
    );
  }

  moveRightOrLeft(isRight: boolean, deltaTime: number): void {
    const right = vec3.create();
    vec3.cross(right, this.pointToLook, this.up);
    vec3.normalize(right, right);

    vec3.scaleAndAdd(
      this.position,
      this.position,
      right,
      isRight ? -SPEED_MOVE * deltaTime : SPEED_MOVE * deltaTime,
    );
  }

  checkUpdate(deltaTime: number): boolean {
    let isUpdate = false;
    if (this.pressedKeys.has(KEY_RIGHT)) {
      this.moveRightOrLeft(false, deltaTime);
      isUpdate = true;
    }
    if (this.pressedKeys.has(KEY_LEFT)) {
      this.moveRightOrLeft(true, deltaTime);
      isUpdate = true;
    }
    if (this.pressedKeys.has(KEY_FORWARD)) {
      this.moveForwardOrBackward(false, deltaTime);
      isUpdate = true;
    }
    if (this.pressedKeys.has(KEY_BACKWARD)) {
      this.moveForwardOrBackward(true, deltaTime);
      isUpdate = true;
    }
    return isUpdate;
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
