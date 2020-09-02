import IColor from "../../interface/IColor";

export interface IFontRendererOptions{
  text: string;
  font: any;
  align: string;
  color: IColor;
}

export interface IAnimatedValues {
  color: IColor;
}