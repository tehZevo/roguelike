var C = {};

module.exports = C;

/** returns new position, or null if no collision */
C.pointXaabb = function(px, py, dx, dy, x1, y1, x2, y2)
{
  var EPS = 0.01;

  var nx = px + dx;
  var ny = py + dy;

  if(nx >= x1 && ny)
}
