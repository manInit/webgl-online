export function canvasInit(selector: string): HTMLCanvasElement {
  const canvasElement = document.querySelector<HTMLCanvasElement>(selector);
  if (!canvasElement) {
    throw new Error(`Canvas with selector ${selector} not found`);
  }

  canvasElement.width = document.documentElement.clientWidth;
  canvasElement.height = document.documentElement.clientHeight;
  return canvasElement;
}
