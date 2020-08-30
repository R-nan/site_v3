
import Vector from "../../utils/Vector";
import { IShapeData } from "../../utils/buildCanvasPaths";
import Boid from "./Boid";
import IColor from "../../interface/IColor";

export interface IBoidsManagerOptions {
  count: number;
  initialPositions: Vector[][];
  boidShape: IShapeData[];
  boidState: (boid: Boid, boids: Boid[]) => void;
  target?: Vector;
  sequence?: Vector[];
  color: IColor;
  size: number;
  maxSpeed?: number;
  showTrail?: boolean;
  distanceToResolve?: number;
}

export interface IBoidShape {
  pathType: TPathType;
  x: number;
  y: number;
}

export interface IBoid {
  position: Vector;
  initialPosition: Vector;
  initialPositionIndex: number;
  velocity: Vector;
  initialVelocity?: Vector;
  acceleration: Vector;
  maxForce: number;
  maxSpeed: number;
  cohesionValue: number;
  alignmentValue: number;
  separationValue: number;
  size: number;
  boidShape: IShapeData[];
  boidState: (boid: Boid, boids: Boid[]) => void;
  target?: Vector;
  sequence?: Vector[];
  showTrail?: number | boolean;
  color: IColor;
  distanceToResolve?: number;
}

export type TPathType = 'm' | 'l' | 'q' | 'c';