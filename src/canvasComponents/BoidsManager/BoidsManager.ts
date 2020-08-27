import CanvasManager from "../CanvasManager/CanvasManager";
import { IBoidsManagerOptions } from "./IBoidsManager";
import Boid from "./Boid";
import Vector from "../../utils/Vector";
import { randomInArray } from "../../utils/random";
import BoidStates from "./BoidStates";

export default class BoidsManager {
  private canvasManager: CanvasManager;
  private options: IBoidsManagerOptions;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private boids: Array<Boid>
  private sequenceCounter: number;
  private sequencePromiseResolver: any;

  constructor(canvasManager: CanvasManager, options: IBoidsManagerOptions) {
    this.canvasManager = canvasManager;
    this.options = options;
    this.canvas = this.canvasManager.canvas;
    this.context = this.canvasManager.context;
    this.boids = [];
    this.sequenceCounter = 0;
    this.sequencePromiseResolver = null;
  }

  public init() {
    const { count, initialPositions, boidShape, boidState, target, sequence} = this.options;

    for( let i = 0; i < count; i++) {
      const randomLetterVector = randomInArray(initialPositions);
      this.boids.push(new Boid(
        this.canvas, 
        this.context,
        {
          position: randomLetterVector.value,
          initialPosition: randomLetterVector.value.copy(),
          initialPositionIndex: randomLetterVector.index,
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
          target,
          sequence,
        }
      ))
    }
    this.canvasManager.modifiers.push(this.draw.bind(this));
  }

  public onResize(initialPositions: {[key: string]: any}): void {
    this.boids.forEach((boid, index) => {
      const { initialPositionIndex } = boid.options;
      boid.setValues({
        position: initialPositions[initialPositionIndex],
        initialPosition: initialPositions[initialPositionIndex].copy(),
        velocity: Vector.random2D(),
        acceleration: new Vector()
      })
    })
  }

  public fold(): void {
    this.boids.forEach(boid => {
      boid.fold().then(() => {
        boid.options.velocity = Vector.random2D();
      });
    })
  }

  public unfold(): void {
    this.boids.forEach(boid => {
      boid.unfold();
    })
  }

  public roost(): Promise<any> {
    return new Promise((resolve) => {
      this.boids.forEach(boid => {
        boid.options.boidState = BoidStates.ROOST;
      })
      Promise.all(this.boids.map((boid) => boid.buildFlyToPromise()
      .then(() => boid.options.boidState = BoidStates.REST)))
      .then(() => {
        resolve();
      })
    })
  }

  protected flySequenceCounter(boid: Boid): void {
    boid.buildFlyToPromise().then(() => {
      if (!boid.options.sequence) return;
      if (this.options.sequence && this.sequenceCounter >= this.options.sequence.length) {
        this.sequencePromiseResolver();
        return this.sequencePromiseResolver = null;
      };

      boid.options.target = boid.options.sequence[this.sequenceCounter++];
      this.flySequenceCounter(boid);
    })
  }

  public flySequence(): Promise<any> {
    return new Promise((resolve) => {
      this.sequencePromiseResolver = resolve;
      this.boids.forEach(boid => {
        if(boid.options.sequence) {
          boid.options.target = boid.options.sequence[this.sequenceCounter];
          boid.options.boidState = BoidStates.FLY_SEQUENCE;
          this.flySequenceCounter(boid)
        }
      })
    })
  }

  public release(): void {
    this.boids.forEach(boid => {
      boid.options.boidState = BoidStates.RELEASE;
    })
  }

  public rest(): void {
    this.boids.forEach(boid => {
      boid.options.boidState = BoidStates.REST;
    })
  }

  protected draw() {
    this.boids.forEach(boid => {
      boid.update(this.boids);
    })
  }
}