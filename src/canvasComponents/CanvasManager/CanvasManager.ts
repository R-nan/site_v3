import { IMousePosition, ICanvasManagerOptions } from "./interface/CanvasManagerTypes";

export default class CanvasManager {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private requestId: number = 0;
  protected options: ICanvasManagerOptions = {
    mousePosition: {x: 0, y: 0}
  }

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  protected onMouseMove(position: IMousePosition) {
    this.options.mousePosition = position;
  }

  public init(): void {
    this.update();
  }

  public update(): void {
    const {width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    this.ctx.fillRect(0, 0, width, height);
    this.requestId = window.requestAnimationFrame(() => this.update());
  }

  public dispose(): void {
    window.cancelAnimationFrame(this.requestId)
  }
}