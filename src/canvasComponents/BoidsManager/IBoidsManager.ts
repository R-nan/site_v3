
import Vector from "../../utils/Vector";

export interface IBoidsManagerOptions {
  count: number;
  initialPositions: Vector[][];
}

export interface IBoidShape {
  pathType: TPathType;
  x: number;
  y: number;
}

export interface IBoid {
  position: Vector;
  initialPosition?: Vector;
  velocity: Vector;
  initialVelocity?: Vector;
  acceleration: Vector;
  maxForce: number;
  maxSpeed: number;
  cohesionValue: number;
  alignmentValue: number;
  separationValue: number;
  size: number;
}

export type TPathType = 'm' | 'l' | 'q' | 'c';