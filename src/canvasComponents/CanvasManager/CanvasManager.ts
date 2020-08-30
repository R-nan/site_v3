import gsap from 'gsap';
import { IMousePosition, ICanvasManagerOptions } from "./ICanvasManager";
import IColor from "../../interface/IColor";

export default class CanvasManager {
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  private requestId: number = 0;
  public options: ICanvasManagerOptions = {
    mousePosition: {x: 0, y: 0},
    backgroundColor: {r: 0, g: 0, b: 0, a: 1}
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

  public resize(): void {
    this.setupCanvas();
  }

  public changeColor(color: IColor): Promise<any> {
    const {r, g, b, a} = color;
    return new Promise((resolve) => {
      gsap.to(
        this.options.backgroundColor, 
        2, 
        { r, g, b, a, ease: 'power2.in', onComplete: resolve }
      );
    })
  }

  public update(): void {
    const {width, height } = this.canvas;
    const {r, g, b, a} = this.options.backgroundColor
    this.context.clearRect(0, 0, width, height);
    this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.context.fillRect(0, 0, width, height);
    this.modifiers.map(modifier => modifier());
    this.requestId = window.requestAnimationFrame(() => this.update());
  }

  public dispose(): void {
    window.cancelAnimationFrame(this.requestId)
  }
}