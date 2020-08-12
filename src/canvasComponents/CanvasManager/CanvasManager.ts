import { IMousePosition, ICanvasManagerOptions } from "./interface/CanvasManagerTypes";

export default class CanvasManager {
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  private requestId: number = 0;
  protected options: ICanvasManagerOptions = {
    mousePosition: {x: 0, y: 0}
  }
  public count: number = 0;
  public modifiers: Array<any>= [];

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  protected onMouseMove(position: IMousePosition) {
    this.options.mousePosition = position;
  }

  public init(): void {
    this.update();
  }

  public update(): void {
    const {width, height } = this.canvas;
    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, width, height);
    this.modifiers.map(modifier => modifier());
    this.requestId = window.requestAnimationFrame(() => this.update());
  }

  public dispose(): void {
    window.cancelAnimationFrame(this.requestId)
  }
}