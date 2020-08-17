export enum PathType {
  MOVETO = 'm',
  LINETO = 'l',
  QUADTO = 'q',
  CUBICTO = 'c'
}

export interface IShapeData {
  pathType: PathType;
  x: number,
  y: number,
  cpx?: number,
  cpy?: number,
  cp2x?: number,
  cp2y?: number
}

export default function buildCanvasPaths(context: CanvasRenderingContext2D, shapeData: IShapeData[], scale: number) {
  context.beginPath();
  for (let i = 0; i < shapeData.length; i++) {
    const path = shapeData[i];
    const pathType = path.pathType;
    const x = path.x * scale;
    const y = path.y * scale;
    const cpx = path.cpx ? path.cpx * scale : 0;
    const cpy = path.cpy ? path.cpy * scale : 0;
    const cp2x = path.cp2x ? path.cp2x * scale : 0;
    const cp2y = path.cp2y ? path.cp2y * scale : 0;

    if (pathType === PathType.MOVETO) {
      context.moveTo(x, y);
    } else if (pathType === PathType.LINETO) {
      context.lineTo(x, y);
    } else if (pathType === PathType.QUADTO) {
      context.quadraticCurveTo(cpx, cpy, x, y);
    } else if (pathType === PathType.CUBICTO) {
      context.bezierCurveTo(cpx, cpy, cp2x, cp2y, x, y);
    }
  }
  context.closePath();
}
