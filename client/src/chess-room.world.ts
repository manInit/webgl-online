import { vec3 } from 'gl-matrix';
import { Cube } from './core/environment/objects/cube';
import { World } from './core/environment/world';
import { WebGLContext } from './core/context/webgl-context.interface';
import { TextObject } from './core/environment/objects/text-object';
import { BillboardImage } from './core/environment/objects/billboard-image';

export function createChessWorld(context: WebGLContext): World {
  const chess: Cube[] = [];
  const count = 30;
  const chessSize = 1;

  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const color =
        (i + j) % 2 === 0 ? vec3.fromValues(0, 0, 0) : vec3.fromValues(1, 1, 1);

      chess.push(
        new Cube(
          context,
          vec3.fromValues(
            i * chessSize + chessSize / 2 - count / 2,
            0,
            j * chessSize + chessSize / 2 - count / 2,
          ),
          vec3.fromValues(chessSize, 0.1, chessSize),
          color,
        ),
      );
    }
  }

  const walls: Cube[] = [];
  const wallColor = vec3.fromValues(0.7, 0.7, 0.7);
  walls.push(
    new Cube(
      context,
      vec3.fromValues(0, 5, -count / 2),
      vec3.fromValues(count, 10, 0.1),
      wallColor,
    ),
  );
  walls.push(
    new Cube(
      context,
      vec3.fromValues(0, 5, count / 2),
      vec3.fromValues(count, 10, 0.1),
      wallColor,
    ),
  );
  const rightWall = new Cube(
    context,
    vec3.fromValues(count / 2, 5, 0),
    vec3.fromValues(count, 10, 0.1),
    wallColor,
  );
  rightWall.rotate(90, 0, 1, 0);
  walls.push(rightWall);

  const leftWall = new Cube(
    context,
    vec3.fromValues(-count / 2, 5, 0),
    vec3.fromValues(count, 10, 0.1),
    wallColor,
  );
  leftWall.rotate(90, 0, 1, 0);
  walls.push(leftWall);

  const blueCube = new Cube(
    context,
    vec3.fromValues(0, 2, -4),
    vec3.fromValues(1, 1, 1),
    vec3.fromValues(0, 0, 0.67),
  );

  const helloWorld = new TextObject(
    context,
    'hello world',
    vec3.fromValues(0, 1, 0),
  );
  const image = new BillboardImage(
    context,
    'character',
    vec3.fromValues(4, 0, 3),
    1 / 1.5,
    3.19 / 1.5,
  );
  const chatBubble = new BillboardImage(
    context,
    'text-bubble',
    vec3.fromValues(0, 0, -5),
    1,
    1,
  );

  return new World([
    blueCube,
    ...chess,
    ...walls,
    helloWorld,
    image,
    chatBubble,
  ]);
}
