import { IMousePosition, ICanvasWrapperOptions } from "./interface/CanvasWrapperTypes";


export default class CanvasWrapper {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  protected options: ICanvasWrapperOptions = {
    mousePosition: {x: 0, y: 0}
  }

  constructor(canvasElement: HTMLCanvasElement) {
    console.log(canvasElement)
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  protected onMouseMove(position: IMousePosition) {
    this.options.mousePosition = position;
  }
}