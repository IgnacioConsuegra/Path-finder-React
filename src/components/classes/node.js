export class Node {
  constructor(
    id = 0,
    value = 0,
    row = null,
    column = null,
    g = 0,
    f = 0,
    h = 0,
    neighbors = [],
    previous = null,
    left = null,
    right = null,
    top = null,
    bottom = null,
    topLeft = null,
    topRight = null,
    bottomLeft = null,
    bottomRight = null,
    minDistance = Infinity,
  ) {
    this.id = id;
    this.value = value;
    this.row = row;
    this.column = column;
    this.right = right;
    this.left = left;
    this.top = top;
    this.bottom = bottom;
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
    this.h = h;
    this.f = f;
    this.g = g;
    this.neighbors = neighbors;
    this.previous = previous;
    this.parent = parent;
    this.minDistance = minDistance;
  }
}
