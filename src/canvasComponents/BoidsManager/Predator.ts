import { IPredator } from './IBoidsManager';
import Vector from '../../utils/Vector';
import ShapeType from './ShapeType';
import buildCanvasPaths from '../../utils/buildCanvasPaths';
import { colorBlack } from '../../pages/Home/Home';
import { map } from '../../utils/utils';
import Boid from './Boid';

export default class Predator {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  public options: IPredator;
  private trailHistory: Vector[];
  private repulsionValue: number;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options?: IPredator) {
    this.canvas = canvas;
    this.context = context;
    this.options = options || {
      target: new Vector(400, 400),
      position: new Vector(400, 400),
      velocity: Vector.random2D(),
      acceleration: new Vector(),
      maxSpeed: 7,
      maxForce: 0.2,
      size: 4,
      boidShape: ShapeType.KITE(),
      color: {r: 255, g: 255, b: 255, a: 1},
    };
    this.repulsionValue = 1;
    this.trailHistory = [];

  }

  private drawTrail(currentPosition: Vector): void {
    this.trailHistory.push(currentPosition.copy());

    if (this.trailHistory.length > 100) {
      this.trailHistory.splice(0, 1);
    }

    this.context.strokeStyle = `rgb(${colorBlack.r}, ${colorBlack.g}, ${colorBlack.b})`;
    this.context.beginPath();

    for(let i = 0; i < this.trailHistory.length; i++) {
      let position = this.trailHistory[i];

      if (i === 0) {
        this.context.moveTo(position.x, position.y);
      } else {
        this.context.lineTo(position.x, position.y)
      }
    }

    this.context.stroke();
  }

  update(boids: Array<Boid>, predators: Array<Predator>) {
    const { position, velocity, acceleration, maxSpeed, maxForce, target } = this.options;
    const maxArrivalSpeed = 15;
    const desired: Vector = Vector.sub(target, position);
    const distance: number = desired.mag();
    desired.normalize();

    let speed = maxArrivalSpeed;

    if (distance < 500) {
      speed = map(distance, 0, 500, 0, maxArrivalSpeed);
      desired.mult(speed);
    } else {
      desired.mult(maxArrivalSpeed);
    }

    const steer = Vector.sub(desired, velocity);
    steer.limit(maxForce)

    
    acceleration.add(steer);
    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0);

    this.draw()
  }

  protected draw(): void {
    const { velocity, position, boidShape, maxSpeed, showTrail } = this.options;
    const theta = velocity.heading() - Math.PI / 2;
    const {r, g, b, a} = this.options.color;

    this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    if (showTrail) this.drawTrail(position);
    this.context.save();
    this.context.translate(position.x, position.y);
    this.context.rotate(theta);
    buildCanvasPaths(this.context, boidShape, (10 * (velocity.mag() / maxSpeed)) + this.options.size);
    this.context.fill();
    this.context.restore();
  }
}