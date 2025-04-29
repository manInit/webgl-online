import { vec3 } from 'gl-matrix';
import { Camera } from './camera';
import { checkCollision } from './collision/check-collision';
import { WebGLContext } from './context/webgl-context.interface';
import { createProjectionMatrix } from './create-projection-matrix';
import { World } from './environment/world';
import { ServerSocket } from './network/server-socket';
import { Textures } from './textures/textures.class';

export function startApp(
  context: WebGLContext,
  world: World,
  url: string,
): void {
  Textures.createTextures(context);

  const projectionMatrix = createProjectionMatrix(context);
  const camera = new Camera(context, true, false);
  const serverSocket = new ServerSocket(url, context);

  context.gl.useProgram(context.program);
  context.gl.enable(context.gl.DEPTH_TEST);
  context.gl.enable(context.gl.CULL_FACE);
  context.gl.cullFace(context.gl.BACK);
  context.gl.enable(context.gl.BLEND);
  context.gl.blendFunc(context.gl.SRC_ALPHA, context.gl.ONE_MINUS_SRC_ALPHA);

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
    const isUpdate = camera.checkUpdate();
    const isCollide = checkCollision(
      camera.getCollisionShape(),
      world.getObjects(),
    );
    if (isCollide) {
      camera.currentPosition = prevCameraPosition;
    } else if (isUpdate) {
      serverSocket.emitPlayerMove(camera.currentPosition);
    }

    const viewMatrix = camera.getViewMatrix();
    world.render(viewMatrix);

    serverSocket.playersObject.forEach((p) => {
      p.render(viewMatrix);
    });

    start = timestamp;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
