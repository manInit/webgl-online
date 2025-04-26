import { RenderObject } from '../environment/render-object.interface';
import { CollisionShape } from './collision-shape.interface';

export function checkCollision(
  shape: CollisionShape,
  objects: RenderObject[],
): boolean {
  return objects.some((object) => {
    const collisionShape = object.getCollision();
    if (!collisionShape) {
      return false;
    }

    return (
      shape.minX <= collisionShape.maxX &&
      shape.maxX >= collisionShape.minX &&
      shape.minY <= collisionShape.maxY &&
      shape.maxY >= collisionShape.minY &&
      shape.minZ <= collisionShape.maxZ &&
      shape.maxZ >= collisionShape.minZ
    );
  });
}
