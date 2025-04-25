import { vec3 } from 'gl-matrix';
import { Camera } from './camera';
import { checkCollision } from './collision/check-collision';
import { WebGLContext } from './context/webgl-context.interface';
import { createProjectionMatrix } from './create-projection-matrix';
import { World } from './environment/world';

export function startApp(context: WebGLContext, world: World): void {
  const projectionMatrix = createProjectionMatrix(context);
  const camera = new Camera(context, true, false);

  context.gl.useProgram(context.program);
  context.gl.enable(context.gl.DEPTH_TEST);
  context.gl.enable(context.gl.CULL_FACE);
  context.gl.cullFace(context.gl.BACK);

  let start: number;
  function render(timestamp: number) {
    if (start === undefined) {
      start = timestamp;
    }
    const deltaTime = timestamp - start;

    context.gl.viewport(
      0,
      0,
      context.gl.canvas.width,
      context.gl.canvas.height,
    );
    context.gl.clearColor(0, 0, 0, 0);
    context.gl.clear(context.gl.COLOR_BUFFER_BIT | context.gl.DEPTH_BUFFER_BIT);

    context.gl.uniformMatrix4fv(
      context.uProjectionMatrixLocation,
      false,
      projectionMatrix,
    );

    const prevCameraPosition = vec3.clone(camera.currentPosition);
    camera.checkUpdate();
    const isCollide = checkCollision(
      camera.getCollisionShape(),
      world.getObjects(),
    );
    if (isCollide) {
      camera.currentPosition = prevCameraPosition;
    }

    const viewMatrix = camera.getViewMatrix();
    world.render(deltaTime, viewMatrix);

    start = timestamp;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
