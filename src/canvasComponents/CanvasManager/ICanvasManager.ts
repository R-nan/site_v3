import IColor from "../../interface/IColor";

export interface IMousePosition {
  x: number;
  y: number;
}

export interface ICanvasManagerOptions {
  mousePosition: IMousePosition;
  backgroundColor: IColor;
}