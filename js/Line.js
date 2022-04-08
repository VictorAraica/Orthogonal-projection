class Line {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.direction = this.p2.vector.sub(this.p1.vector).normalize();
    this.m = (this.p1.z - this.p2.z) / (this.p1.x - this.p1.x);
  }

  getPointUsingX(x) {
    if (this.p1.x === this.p2.x) return false;

    let magnitude = (x - this.p1.x) / this.direction.x;

    let newPointX = this.p1.x + magnitude * this.direction.x;
    let newPointY = this.p1.y + magnitude * this.direction.y;
    let newPointZ = this.p1.z + magnitude * this.direction.z;

    let newPoint = new Point(newPointX, newPointY, newPointZ);

    return newPoint;
  }

  getPointUsingY(y) {
    if (this.p1.y === this.p2.y) return false;

    let magnitude = (y - this.p1.y) / this.direction.y;

    let newPointX = this.p1.x + magnitude * this.direction.x;
    let newPointY = this.p1.y + magnitude * this.direction.y;
    let newPointZ = this.p1.z + magnitude * this.direction.z;

    let newPoint = new Point(newPointX, newPointY, newPointZ);

    return newPoint;
  }

  getPointUsingZ(z) {
    if (this.p1.z === this.p2.z) {
      return false;
    }

    let magnitude = (z - this.p1.z) / this.direction.z;

    let newPointX = this.p1.x + magnitude * this.direction.x;
    let newPointY = this.p1.y + magnitude * this.direction.y;
    let newPointZ = this.p1.z + magnitude * this.direction.z;

    let newPoint = new Point(newPointX, newPointY, newPointZ);

    return newPoint;
  }
}
