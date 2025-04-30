import { vec3 } from 'gl-matrix';
import { TextBubble } from './text-bubble';
import { TextWindowManager } from './text-window-manager';
import { RenderCallback } from '../core/app.interface';

export const chatDisplayCallback: RenderCallback = ({
  socket,
  playerState: playerWithPosition,
}): void => {
  const bubbles = socket.bubblesObject;
  if (bubbles.length === 0) {
    return;
  }

  let nearestBubble!: TextBubble;
  let minDistance = Infinity;
  bubbles.forEach((bubble) => {
    const playerX = playerWithPosition.position[0];
    const playerZ = playerWithPosition.position[2];

    const textX = bubble.billboardImage.modelMatrix[12];
    const textZ = bubble.billboardImage.modelMatrix[14];

    const distance = vec3.distance(
      vec3.fromValues(playerX, 0, playerZ),
      vec3.fromValues(textX, 0, textZ),
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestBubble = bubble;
    }
  });

  if (minDistance <= nearestBubble.DISTANCE_ACTIVATION) {
    TextWindowManager.show(nearestBubble.author, nearestBubble.text);
    if (
      nearestBubble.billboardImage.modelMatrix[13] < nearestBubble.MAX_HEIGHT
    ) {
      nearestBubble.billboardImage.translate(0, nearestBubble.SPEED, 0);
    }
  } else {
    TextWindowManager.hide();
    if (nearestBubble.billboardImage.modelMatrix[13] > 0) {
      nearestBubble.billboardImage.translate(0, -nearestBubble.SPEED, 0);
    }
  }
  bubbles
    .filter((b) => b !== nearestBubble)
    .forEach((b) => {
      if (b.billboardImage.modelMatrix[13] > 0) {
        b.billboardImage.translate(0, -b.SPEED, 0);
      }
    });
};
