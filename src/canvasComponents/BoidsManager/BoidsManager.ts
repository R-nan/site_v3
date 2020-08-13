import CanvasManager from "../CanvasManager/CanvasManager";
import { IBoidsManagerOptions, IBoid } from "./IBoidsManager";
import Boid from "./Boid";
import Vector from "../../utils/Vector";
// import { IAnimatedValues } from "../FontRenderer/IFontRenderer";

export default class BoidsManager {
  private canvasManager: CanvasManager;
  private options: IBoidsManagerOptions;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private boids: Array<Boid>
  // private animatedValues: IAnimatedValues;

  constructor(canvasManager: CanvasManager, options: IBoidsManagerOptions) {
    this.canvasManager = canvasManager;
    this.options = options;
    this.canvas = this.canvasManager.canvas;
    this.context = this.canvasManager.context;
    this.boids = [];
    // this.animatedValues = {}
  }



  public init() {
    const { count, maxForce, maxSpeed, cohesionValue, alignmentValue, separationValue } = this.options;

    for( let i = 0; i < count; i++) {
      this.boids.push(new Boid(this.canvas, this.context))
    }
    this.canvasManager.modifiers.push(this.draw.bind(this));
  }

  protected draw() {
    this.boids.forEach(boid => {
      boid.update(this.boids);
    })
  }
}