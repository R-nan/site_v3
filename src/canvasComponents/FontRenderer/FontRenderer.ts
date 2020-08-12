import CanvasManager from "../CanvasManager/CanvasManager";
import * as FontPathRenderer from 'fontpath-canvas';
import { IFontRendererOptions } from "./interface/FontRendererTypes";

export default class FontRenderer {
  private canvasManager: CanvasManager;
  private options: IFontRendererOptions;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private renderer: any;

  constructor(canvasManager: CanvasManager, options: IFontRendererOptions) {
    this.canvasManager = canvasManager;
    this.options = options;
    this.canvas = this.canvasManager.canvas;
    this.context = this.canvasManager.context;
    this.renderer = new FontPathRenderer();
  }

  public init(): void {
    this.renderer.text = this.options.text;
    this.renderer.font = this.options.font;
    this.renderer.fontSize = this.canvas.width / 8;
    this.renderer.align = this.options.align;
    this.renderer.layout(this.canvas.width);

    this.setup();
  }

  public setup(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let bounds = this.renderer.getBounds();
    //center the text in the window
    let x = (window.innerWidth - bounds.width) / 2,
      y = bounds.height + (window.innerHeight - bounds.height) / 2;

          //the bounds fit tightly to the text glyphs.
    //Often UI elements will include the descender in the bounds
    //to make it look more even along all edges.
    let descender = this.renderer.getDescender();

    //draw the card background with some padding
    let pad = 20;
    this.context.fillStyle = 'black';
    this.context.fillRect(
      bounds.x + x - pad,
      bounds.y + y - pad,
      pad * 2 + bounds.width,
      pad * 2 + bounds.height + descender,
    );

    //now draw the text
    this.context.fillStyle = 'white';
    this.renderer.fill(this.context, x, y);

    this.canvasManager.modifiers.push(this.draw.bind(this ));
  }

  public draw() {
    const bounds = this.renderer.getBounds();
    //center the text in the window
    const x = (window.innerWidth - bounds.width) / 2,
      y = bounds.height + (window.innerHeight - bounds.height) / 2;
    this.context.fillStyle = `rgb(144, 142, 32)`;
    this.renderer.fill(this.context, x, y);
  }
}