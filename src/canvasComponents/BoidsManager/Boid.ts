import { IBoid } from "./IBoidsManager";
import Vector from "../../utils/Vector";
import { random } from "../../utils/random";

export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private options: IBoid;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options?: IBoid) {
    this.canvas = canvas;
    this.context = context;
    this.options = options || {
      position: new Vector(Math.random() * canvas.width, Math.random() * canvas.height),
      velocity: Vector.random2D(),
      acceleration: new Vector(),
      maxSpeed: 7,
      maxForce: 0.2,
      cohesionValue: 1,
      alignmentValue: 0.3,
      separationValue: 1
    };

    this.setup();
  }

  private setup(): void {
    const { velocity } = this.options;

    velocity.setMag(random(0.5, 5.5));

  }

  public update(): void {
    const { velocity, position, acceleration, maxSpeed } = this.options;

    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
    
    this.draw();
  }

  protected draw(): void {
    const { velocity, position } = this.options;
    const theta = velocity.heading() - Math.PI / 2;

    this.context.fillStyle = 'black';
    this.context.save();
    this.context.translate(position.x, position.y);
    this.context.rotate(theta);
    this.context.beginPath()
    this.context.arc(position.x, position.y, 10, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.fill();
    this.context.restore();
  }
}