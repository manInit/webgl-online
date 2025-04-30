import { RenderCallback } from '../core/app.interface';
import { TextInputManager } from './text-input-manager';

export const createInputBubbleCallback = (
  textInputManager: TextInputManager,
): RenderCallback => {
  const renderCb: RenderCallback = ({ state, playerState }): void => {
    textInputManager.state = state;
    textInputManager.playerState = playerState;
  };

  return renderCb;
};
