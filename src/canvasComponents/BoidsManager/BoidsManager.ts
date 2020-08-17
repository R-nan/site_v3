import CanvasManager from "../CanvasManager/CanvasManager";
import { IBoidsManagerOptions, IBoid } from "./IBoidsManager";
import Boid from "./Boid";
import Vector from "../../utils/Vector";
import { randomInArray } from "../../utils/random";
import BoidStates from "./BoidStates";
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
    const { count, initialPositions, boidShape, boidState} = this.options;
    
    for( let i = 0; i < count; i++) {
      const randomLetterVector = randomInArray(initialPositions);
      this.boids.push(new Boid(
        this.canvas, 
        this.context,
        {
          position: randomLetterVector,
          velocity: Vector.random2D(),
          acceleration: new Vector(),
          maxSpeed: 7,
          maxForce: 0.2,
          cohesionValue: 1,
          alignmentValue: 0.3,
          separationValue: 1,
          size: 4,
          boidShape,
          boidState,
        }
      ))
    }
    this.canvasManager.modifiers.push(this.draw.bind(this));
  }

  protected fold(): void {
    // make fold animation
  }

  protected unfold(): void {
    // make unfold animation
  }

  public release(): void {
    this.boids.forEach(boid => {
      boid.options.boidState = BoidStates.RELEASE;
    })
  }

  protected draw() {
    this.boids.forEach(boid => {
      boid.update(this.boids);
    })
  }
}