import Vector from './Vector';

var MOVETO = 'm',
  LINETO = 'l',
  QUADTO = 'q',
  CUBICTO = 'c';

/**
 * Draws a glyph as a series of path operations (moveTo, bezierCurveTo, etc),
 * with the optional translation and scaling applied.
 */
export default function decomposeToVectors(glyph, scale, x, y) {
  if (!glyph.path || glyph.path.length === 0) return;
  let vectors = [];
  x = x || 0;
  y = y || 0;
  scale = typeof scale === 'number' ? scale : 1;

  var path = glyph.path;
  for (var i = 0; i < path.length; i++) {
    var p = path[i];
    var f = p[0];
    if (f === MOVETO) vectors.push(new Vector(p[1] * scale + x, p[2] * -scale + y));
    else if (f === LINETO) vectors.push(new Vector(p[1] * scale + x, p[2] * -scale + y));
    else if (f === QUADTO)
      vectors.push(
        new Vector(p[1] * scale + x, p[2] * -scale + y),
        new Vector(p[3] * scale + x, p[4] * -scale + y),
      );
    else if (f === CUBICTO)
      vectors.push(
        new Vector(p[1] * scale + x, p[2] * -scale + y),
        new Vector(p[3] * scale + x, p[4] * -scale + y),
        new Vector(p[5] * scale + x, p[6] * -scale + y),
      );
  }
  return vectors;
}
