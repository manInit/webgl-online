import { vec3 } from 'gl-matrix';
import { MutableState, PlayerState } from '../core/app.interface';
import { ServerSocket } from '../core/network/server-socket';

const INPUT_CONTAINER_SELECTOR = '#input-container';
const INPUT_SELECTOR = '#input-container input';

const INPUT_CONTAINER_ELEMENT = document.querySelector<HTMLElement>(
  INPUT_CONTAINER_SELECTOR,
)!;
const INPUT_ELEMENT = document.querySelector<HTMLInputElement>(INPUT_SELECTOR)!;

INPUT_ELEMENT.addEventListener('keypress', (event) => {
  const char = event.key;
  if (/[\u0400-\u04FF]/.test(char)) {
    event.preventDefault();
  }
});

export class TextInputManager {
  private isVisible = false;

  setState: ((s: MutableState) => void) | null = null;

  playerState: PlayerState | null = null;

  socket: ServerSocket | null = null;

  private listener = this.leaveTextEventListener.bind(this);

  leaveTextEventListener(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || !this.playerState || !this.socket) {
      return;
    }

    const text = INPUT_ELEMENT.value;

    const textPos = vec3.clone(this.playerState.position);
    textPos[1] = 0;
    this.socket.emitPlayerMessage(text, textPos);
    this.hide();
    INPUT_ELEMENT.value = '';
  }

  show(event?: KeyboardEvent): void {
    if (this.isVisible || !this.setState) {
      return;
    }

    event?.preventDefault();
    INPUT_CONTAINER_ELEMENT.style.display = 'block';
    INPUT_ELEMENT.focus();
    this.isVisible = true;
    this.setState({
      controlsEnabled: false,
    });

    INPUT_ELEMENT.addEventListener('keyup', this.listener);
  }

  hide(event?: KeyboardEvent): void {
    if (!this.isVisible || !this.setState) {
      return;
    }

    event?.preventDefault();
    INPUT_CONTAINER_ELEMENT.style.display = '';
    this.isVisible = false;
    this.setState({
      controlsEnabled: true,
    });
    INPUT_ELEMENT.removeEventListener('keyup', this.listener);
  }

  listenKeyPress(keyCodeOpen: string, keyCodeHide: string): void {
    document.addEventListener('keydown', (event) => {
      if (event.code === keyCodeOpen) {
        this.show(event);
      }
      if (event.code === keyCodeHide) {
        this.hide(event);
      }
    });
  }
}
