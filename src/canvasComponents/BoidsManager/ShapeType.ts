import { IShapeData, PathType } from "../../utils/buildCanvasPaths";

const ShapeType: {[key: string]: () => IShapeData[]} = {
  KITE: () => {
    return [
    {
      pathType: PathType.MOVETO,
      x: 0,
      y: -2
    },
    {
      pathType: PathType.LINETO,
      x: 0, //open state = -2
      y: 2
    },
    {
      pathType: PathType.LINETO,
      x: 0,
      y: 4
    },
    {
      pathType: PathType.LINETO,
      x: 0, // open state = 2,
      y: 2
    }
  ]
}
};

export default ShapeType;