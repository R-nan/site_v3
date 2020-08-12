export interface IFontRendererOptions{
  text: string;
  font: any;
  align: string;
  color?: IColor;
}

export interface IColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface IAnimatedValues {
  color: IColor;
}