import CanvasManager from "../CanvasManager/CanvasManager";
import * as FontPathRenderer from 'fontpath-canvas';
import { IFontRendererOptions, IAnimatedValues } from "./IFontRenderer";
import gsap from 'gsap';
import IColor from "../../interface/IColor";
import decomposeToVectors from "../../utils/decomposeToVectors";
import Vector from "../../utils/Vector";

export default class FontRenderer {
  private canvasManager: CanvasManager;
  private options: IFontRendererOptions;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private renderer: any;
  private animatedValues: IAnimatedValues;
  public glyphs: any = {};
  public fontVectors: Vector[][] = [];

  constructor(canvasManager: CanvasManager, options: IFontRendererOptions) {
    this.canvasManager = canvasManager;
    this.options = options;
    this.canvas = this.canvasManager.canvas;
    this.context = this.canvasManager.context;
    this.renderer = new FontPathRenderer();
    this.animatedValues = this.options.color ? {color: this.options.color} : {color: {r:0,g:0,b:0}};
  }

  public init(): void {
    this.renderer.text = this.options.text;
    this.renderer.font = this.options.font;
    this.renderer.fontSize = this.canvas.width < 768 ? this.canvas.width / 4 : this.canvas.width / 8;
    this.renderer.align = this.options.align;
    this.renderer.layout(this.canvas.width);

    this.setup();
  }

  public getFontVectors(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(() => {
          this.fontVectors = this.buildFontVectors();
          return this.fontVectors;
        });
      }, 100)
    })
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
    this.context.fillStyle = 'white';
    this.context.fillRect(
      bounds.x + x - pad,
      bounds.y + y - pad,
      pad * 2 + bounds.width,
      pad * 2 + bounds.height + descender,
    );

  }
  
  public addToCanvas(): void {
    this.canvasManager.modifiers.push(this.draw.bind(this ));
  }

  private buildFontVectors(): Array<Array<Vector>> {
    let letterVectors: Array<Array<Vector>> = [];

    this.renderer.data.glyphs.forEach((glyphData: any) => {
      let gData = glyphData;
      let glyph = gData.glyph,
        scale = gData.scale[0],
        px = gData.position[0],
        py = gData.position[1];
        let decomposedGlyphVectors = decomposeToVectors(glyph, scale, px, py);
        this.glyphs[glyphData.charCode] = decomposedGlyphVectors;
        if (decomposedGlyphVectors) {
          letterVectors = [...letterVectors, ...decomposedGlyphVectors as any];
        }

        // take out dot in letter 'i'
        // if(glyphData.charCode === 105) {
        //   glyphData.glyph.path.splice(13, 9);
        // }
    });

    return letterVectors;
  }

  public changeColor(color: IColor): void {
    const {r, g, b, a} = color;
    gsap.to(
      this.animatedValues.color, 
      2, 
      { r, g, b, a, ease: 'power2.in' }
    );
  }

  public draw(): void {
    const bounds = this.renderer.getBounds();
    //center the text in the window
    const x = (window.innerWidth - bounds.width) / 2,
      y = bounds.height + (window.innerHeight - bounds.height) / 2;
    this.context.fillStyle = `rgba(${this.animatedValues.color.r}, ${this.animatedValues.color.g}, ${this.animatedValues.color.b})`;
    this.renderer.fill(this.context, x, y);
  }
}