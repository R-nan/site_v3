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
      separationValue: 1,
      size: 4,
    };

    this.setup();
  }

  private setup(): void {
    const { velocity } = this.options;

    velocity.setMag(random(0.5, 5.5));
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
      console.log("this happne? right")

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
    // if (this.goToOrigin) {
    //   return this.returnToOrigin();
    // } else {
    // }
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
    const { velocity, position, acceleration, maxSpeed } = this.options;

    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
    
    this.flock(boids);
    this.checkEdges()

    this.draw();
  }

  protected draw(): void {
    const { velocity, position } = this.options;
    const theta = velocity.heading() - Math.PI / 2;

    this.context.fillStyle = 'black';
    this.context.save();
    // this.context.translate(position.x, position.y);
    // this.context.rotate(theta);
    this.context.beginPath()
    this.context.arc(position.x, position.y, 10, 0, Math.PI * 2, true);
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }
}