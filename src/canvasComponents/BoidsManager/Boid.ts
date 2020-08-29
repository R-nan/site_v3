import gsap from 'gsap';
import { IBoid } from "./IBoidsManager";
import Vector from "../../utils/Vector";
import { random } from "../../utils/random";
import ShapeType from "./ShapeType";
import buildCanvasPaths from "../../utils/buildCanvasPaths";
import BoidStates from "./BoidStates";
import { map } from '../../utils/utils';

export default class Boid {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  public options: IBoid;
  public flyToResolver: any;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options?: IBoid) {
    this.canvas = canvas;
    this.context = context;
    this.flyToResolver = null;
    this.options = options || {
      position: new Vector(Math.random() * canvas.width, Math.random() * canvas.height),
      initialPosition: Vector.random2D(),
      initialPositionIndex: 0,
      velocity: Vector.random2D(),
      acceleration: new Vector(),
      maxSpeed: 7,
      maxForce: 0.2,
      cohesionValue: 1,
      alignmentValue: 0.3,
      separationValue: 1,
      size: 4,
      boidShape: ShapeType.KITE(),
      boidState: BoidStates.REST,
      target: new Vector(0, 0),
      sequence: [new Vector(100, 600), new Vector(300, 300), new Vector(400, 10)],
      color: {r: 255, g: 255, b: 255, a: 1}
    };

    this.setup();
  }

  private setup(): void {
    const { velocity } = this.options;

    velocity.setMag(random(0.5, 5.5));
  }

  public setValues(values: any) {
    Object.keys(values).map((key) => {
      return this.options[key as keyof IBoid] = values[key];
    })
  }

  public unfold(): Promise<any> {
    return new Promise((resolve) => {
      gsap.to(this.options.boidShape[1], 2, {
        x: -2,
        ease: 'power2.in'
      })
      gsap.to(this.options.boidShape[3], 2, {
        x: 2,
        ease: 'power2.in',
        onComplete: () => {
          resolve();
        }
      })
    })
  }

  public fold(): Promise<any> {
    return new Promise((resolve) => {
      gsap.to(this.options.boidShape[1], 2, {
        x: 0,
        ease: 'power2.in'
      })
      gsap.to(this.options.boidShape[3], 2, {
        x: 0,
        ease: 'power2.in',
        onComplete: () => {
          resolve();
        }
      })
    })
  }

  public buildFlyToPromise(): Promise<any> {
    return new Promise((resolve) => {
      this.flyToResolver = resolve;
    })
  }

  public flyTo(target: Vector): void {
    const { position, velocity, acceleration, maxSpeed, maxForce } = this.options;
    const maxArrivalSpeed = 5;
    const desired: Vector = Vector.sub(target, position);
    const distance: number = desired.mag();
    desired.normalize();

    let speed = maxArrivalSpeed;

    if (distance < 200) {
      speed = map(distance, 0, 200, 0, maxArrivalSpeed);
      desired.mult(speed);
    } else {
      desired.mult(maxSpeed);
    }

    const steer = Vector.sub(desired, velocity);
    steer.limit(maxForce)
    acceleration.add(steer);
    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0);

    if (distance <= 2 && this.flyToResolver) {
      this.flyToResolver();
      this.flyToResolver = null;
    }
  }

  protected separation(boids: Array<Boid>, perception: number): Vector {
    const { position, velocity, maxSpeed, maxForce } = this.options;

    // add opposing force that is inversly proportional to neighboring boids
    let steering = new Vector();
    let total = 0;

    for (let other of boids) {
      const distance = Vector.dist(position, other.options.position);
      if (other !== this && distance < perception) {
        const diff = Vector.sub(position, other.options.position);
        if (distance) diff.div(distance);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
    }

    if (steering.mag() > 0) {
      steering.setMag(maxSpeed);
      steering.sub(velocity);
      steering.limit(maxForce);
    }
    return steering;
  }

  protected alignment(boids: Array<Boid>, perception: number): Vector {
    const { position, velocity, maxSpeed, maxForce } = this.options;

    let steering = new Vector();
    let total = 0;

    for (let other of boids) {
      const distance = Vector.dist(position, other.options.position);

      if (other !== this && distance < perception) {
        steering.add(other.options.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(maxSpeed);
      steering.sub(velocity);
      steering.limit(maxForce);
    } else {
      steering = new Vector(0, 0);
    }
    return steering;
  }


  protected cohesion(boids: Array<Boid>, perception: number): Vector {
    const { position, velocity, maxSpeed, maxForce } = this.options;
    // take average location and steer the current location to it
    let steering = new Vector();
    let total = 0;

    for (let other of boids) {
      const distance = Vector.dist(position, other.options.position);

      if (other !== this && distance < perception) {
        steering.add(other.options.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(position);
      steering.setMag(maxSpeed);
      steering.sub(velocity);
      steering.limit(maxForce);
    } else {
      steering = new Vector(0, 0);
    }
    return steering;
  }

  private checkEdges(): void {
    const { position } = this.options;

    if (position.x < 0) {
      position.x = this.canvas.width;
    } else if (position.x >= this.canvas.width) {
      position.x = 0;
    }

    if (position.y <= 0) {
      position.y = this.canvas.height;
    } else if (position.y >= this.canvas.height) {
      position.y = 0;
    }
  }

  public flock(boids: Array<Boid>) {
    const {acceleration, alignmentValue, cohesionValue, separationValue, size} = this.options
    const perception = size * 50;
    const nearbyBoids = boids;
    acceleration.set(0, 0);
    let alignment = this.alignment(nearbyBoids, perception);
    let cohesion = this.cohesion(nearbyBoids, perception);
    let separation = this.separation(nearbyBoids, perception);

    acceleration.add(alignment.mult(alignmentValue));
    acceleration.add(cohesion.mult(cohesionValue));
    acceleration.add(separation.mult(separationValue));
  }

  public update(boids: Array<Boid>): void {
    this.options.boidState(this, boids);
    this.checkEdges()
    this.draw();
  }

  protected draw(): void {
    const { velocity, position, boidShape, maxSpeed } = this.options;
    const theta = velocity.heading() - Math.PI / 2;
    const {r, g, b, a} = this.options.color;

    this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.context.save();
    this.context.translate(position.x, position.y);
    this.context.rotate(theta);
    buildCanvasPaths(this.context, boidShape, (10 * (velocity.mag() / maxSpeed)) + this.options.size);
    this.context.fill();
    this.context.restore();
  }
}