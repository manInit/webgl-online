import { Camera } from './camera';
import { WebGLContext } from './context/webgl-context.interface';
import { createProjectionMatrix } from './create-projection-matrix';
import { World } from './environment/world';

export function startApp(context: WebGLContext, world: World): void {
  const projectionMatrix = createProjectionMatrix(context);
  const camera = new Camera();
  const viewMatrix = camera.getViewMatrix();

  context.gl.useProgram(context.program);
  context.gl.enable(context.gl.DEPTH_TEST);

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
    // @TODO fix rotate. Create and move to update method
    world.getObjects()[0].rotate(0.01, 0.1, 0.1, 0.2);
    world.render(deltaTime, viewMatrix);

    start = timestamp;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
