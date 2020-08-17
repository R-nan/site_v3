import { IShapeData, PathType } from "../../utils/buildCanvasPaths";

const ShapeType = {
  KITE: (size: number): IShapeData[] => {
    return [
      {
        pathType: PathType.MOVETO,
        x: 0,
        y: -size * 2
      },
      {
        pathType: PathType.LINETO,
        x: -size * 2,
        y: size * 2
      },
      {
        pathType: PathType.LINETO,
        x: 0,
        y: size * 4
      },
      {
        pathType: PathType.LINETO,
        x: size * 2,
        y: size * 2
      }
    ]
  }
};

export default ShapeType;