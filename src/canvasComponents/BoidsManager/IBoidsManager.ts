
import Vector from "../../utils/Vector";
import { IShapeData } from "../../utils/buildCanvasPaths";
import Boid from "./Boid";

export interface IBoidsManagerOptions {
  count: number;
  initialPositions: Vector[][];
  boidShape: IShapeData[];
  boidState: (boid: Boid) => void;
  target?: Vector;
  sequence?: Vector[];
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
  boidState: (boid: Boid) => void;
  target?: Vector;
  sequence?: Vector[];
}

export type TPathType = 'm' | 'l' | 'q' | 'c';