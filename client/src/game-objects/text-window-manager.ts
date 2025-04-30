const TEXT_CONTAINER_SELECTOR = '#text-dialogue';
const AUTHOR_SELECTOR = '#text-dialogue__author';
const TEXT_SELECTOR = '#text-dialogue__text';

const TEXT_CONTAINER_ELEMENT = document.querySelector<HTMLElement>(
  TEXT_CONTAINER_SELECTOR,
)!;
const AUTHOR_ELEMENT = document.querySelector<HTMLElement>(AUTHOR_SELECTOR)!;
const TEXT_ELEMENT = document.querySelector<HTMLElement>(TEXT_SELECTOR)!;

export class TextWindowManager {
  static textShown = false;

  static show(author: string, text: string): void {
    if (TextWindowManager.textShown && text === TEXT_ELEMENT.textContent) {
      return;
    }

    AUTHOR_ELEMENT.textContent = author;
    TEXT_ELEMENT.textContent = text;
    TEXT_CONTAINER_ELEMENT.style.display = 'block';
    TextWindowManager.textShown = true;
  }

  static hide(): void {
    if (!TextWindowManager.textShown) {
      return;
    }

    AUTHOR_ELEMENT.textContent = '';
    TEXT_ELEMENT.textContent = '';
    TEXT_CONTAINER_ELEMENT.style.display = '';
    TextWindowManager.textShown = false;
  }
}
