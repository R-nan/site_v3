import gsap from 'gsap';
import Vector from '../../utils/Vector';
import buildCanvasPaths from "../../utils/buildCanvasPaths";
import CanvasManager from '../CanvasManager/CanvasManager';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import IColor from '../../interface/IColor';
import { map } from '../../utils/utils';

export default class BoidPath {
  canvasManager: any;
  options: any;
  canvas: any;
  context: any;
  trailHistory: any[];
  playingSequence: boolean;

  constructor(canvasManager: CanvasManager, options: any) {
    gsap.registerPlugin(MotionPathPlugin);
    this.canvasManager = canvasManager;
    this.canvas = this.canvasManager.canvas;
    this.context = this.canvasManager.context;
    this.options = options;
    this.trailHistory = [];
    this.playingSequence = true;
  }

  public unfold(): Promise<any> {
    return new Promise((resolve) => {
      gsap.to(this.options.shape[1], 2, {
        x: -2,
        ease: 'power2.in'
      })
      gsap.to(this.options.shape[3], 2, {
        x: 2,
        ease: 'power2.in',
        onComplete: () => {
          resolve();
        }
      })
    })
  }

  public playSequence(): Promise<void> {
    return new Promise((resolve) => {
      const {sequence} = this.options;
      const options = this.options;
      let proxy = {value: 0};
  
      MotionPathPlugin.cacheRawPathMeasurements(sequence);
     
      gsap.to(proxy, {
        value: 1, 
        duration: 10, 
        ease: "power2.inOut",
        onUpdate() {
          const progress = proxy.value;
          const pathData = MotionPathPlugin.getPositionOnPath(sequence, progress, true);
  
          options.angle = (pathData as any).angle * (Math.PI/180);
          options.position = new Vector(pathData.x, pathData.y)
        },
        onComplete: () => {
          resolve();
        }
      })
    })
  }

  public fold(): Promise<any> {
    return new Promise((resolve) => {
      gsap.to(this.options.shape[1], 2, {
        x: 0,
        ease: 'power2.in'
      })
      gsap.to(this.options.shape[3], 2, {
        x: 0,
        ease: 'power2.in',
        onComplete: () => {
          resolve();
        }
      })
    })
  }

  private drawTrail(currentPosition: Vector): void {
    const { trailColor } = this.options;

    this.trailHistory.push(currentPosition.copy());

    if (this.trailHistory.length > 100) {
      this.trailHistory.splice(0, 1);
    }

    this.context.strokeStyle = `rgb(${trailColor.r}, ${trailColor.g}, ${trailColor.b})`;
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

  public changeColor(color: IColor): void {
    const {r, g, b, a} = color;
    gsap.to(
      this.options.color, 
      2, 
      { r, g, b, a, ease: 'power2.in' }
    );
  }

  public addToCanvas(index: number): void {
    this.canvasManager.modifiers.splice(index, 0, this.draw.bind(this))
  }

  public arrive(): void {
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
  }

  protected draw(): void {
    const { position, shape, angle, velocity, maxSpeed } = this.options;
    const {r, g, b, a} = this.options.color;

    if(!this.playingSequence) this.arrive();
    

    this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.drawTrail(position);
    this.context.save();
    this.context.translate(position.x, position.y);
    if(!this.playingSequence) {
      const theta = velocity.heading() - Math.PI / 2;
      this.context.rotate(theta);
      buildCanvasPaths(this.context, shape, (10 * (velocity.mag() / maxSpeed)) + this.options.size);
    } else {
      this.context.rotate(angle - (Math.PI / 2));
      buildCanvasPaths(this.context, shape, this.options.size);
    }
    this.context.fill();
    this.context.restore();
  }
}