import { RenderCallback } from '../core/app.interface';
import { TextInputManager } from './text-input-manager';

export const createInputBubbleCallback = (
  textInputManager: TextInputManager,
): RenderCallback => {
  const renderCb: RenderCallback = ({
    setState,
    playerState,
    socket,
  }): void => {
    textInputManager.setState = setState;
    textInputManager.playerState = playerState;
    textInputManager.socket = socket;
  };

  return renderCb;
};
