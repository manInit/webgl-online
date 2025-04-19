import { mat4 } from 'gl-matrix';

// @TODO Make realization
export class Camera {
  private readonly viewMatrix = mat4.create();

  getViewMatrix() {
    const eye = [0, 0, 4] as const; // Камера
    const center = [0, 0, 0] as const; // Смотрит на центр
    const up = [0, 1, 0] as const; // Направление вверх
    mat4.lookAt(this.viewMatrix, eye, center, up);
    return this.viewMatrix;
  }
}
