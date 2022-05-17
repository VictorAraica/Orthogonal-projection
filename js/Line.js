class Line {
  // if p2 is a vector it will be taken as the direction vector
  constructor(p1, p2) {
    this.type = "line";
    this.p1 = p1;
    if (p2 instanceof Point) {
      this.p2 = p2;
      this.direction = this.p2.vector.sub(this.p1.vector).normalize();
    } else {
      this.direction = p2;
      this.p2 = new Point(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
    }

    let m = (p2.y - p1.y) / (p2.x - p1.x);
    this.equationY = {
      a: m,
      b: -1,
      c: -m * p1.x + p1.y,
    };

    m = (p2.z - p1.z) / (p2.x - p1.x);
    this.equationZ = {
      a: m,
      b: -1,
      c: -m * p1.x + p1.z,
    };

    this.show = true;
    this.color = [255, 255, 255];
    this.width = 2;
  }

  getPointUsingX(x) {
    if (this.p1.x === this.p2.x) return false;

    let magnitude = (x - this.p1.x) / this.direction.x;

    let newPointX = this.p1.x + magnitude * this.direction.x;
    let newPointY = this.p1.y + magnitude * this.direction.y;
    let newPointZ = this.p1.z + magnitude * this.direction.z;

    return new Point(newPointX, newPointY, newPointZ);
  }

  getPointUsingY(y) {
    if (this.p1.y === this.p2.y) return false;

    let magnitude = (y - this.p1.y) / this.direction.y;

    let newPointX = this.p1.x + magnitude * this.direction.x;
    let newPointY = this.p1.y + magnitude * this.direction.y;
    let newPointZ = this.p1.z + magnitude * this.direction.z;

    return new Point(newPointX, newPointY, newPointZ);
  }

  getPointUsingZ(z) {
    if (this.p1.z === this.p2.z) {
      return false;
    }

    let magnitude = (z - this.p1.z) / this.direction.z;

    let newPointX = this.p1.x + magnitude * this.direction.x;
    let newPointY = this.p1.y + magnitude * this.direction.y;
    let newPointZ = this.p1.z + magnitude * this.direction.z;

    return new Point(newPointX, newPointY, newPointZ);
  }

  lineIntersection(l) {
    const p1x = this.p1.x;
    const p2x = l.p1.x;
    const p1y = this.p1.y;
    const p2y = l.p1.y;
    const p1z = this.p1.z;
    const p2z = l.p1.z;
    const dir1x = this.direction.x;
    const dir2x = l.direction.x;
    const dir1y = this.direction.y;
    const dir2y = l.direction.y;
    const dir1z = this.direction.z;
    const dir2z = l.direction.z;

    // sistema de ecuaciones

    const top = p1y * dir2x - p2y * dir2x - p1x * dir2y + p2x * dir2y;
    const bot = dir1x * dir2y - dir1y * dir2x;

    const alfa = top / bot;

    const beta = (p1x + alfa * dir1x - p2x) / dir2x;

    if ((p1z + alfa * dir1z).toFixed(2) === (p2z + beta * dir2z).toFixed(2)) {
      const x = (p1x + alfa * dir1x).toFixed(2);
      const y = (p1y + alfa * dir1y).toFixed(2);
      const z = (p1z + alfa * dir1z).toFixed(2);

      return new Point(x, y, z);
    }
    return false;
  }

  planeIntersection(plane) {
    let alfa =
      (plane.equation.x * this.p1.x +
        plane.equation.y * this.p1.y +
        plane.equation.z * this.p1.z +
        plane.equation.d) /
      -(
        plane.equation.x * this.direction.x +
        plane.equation.y * this.direction.y +
        plane.equation.z * this.direction.z
      );

    const x = (this.p1.x + alfa * this.direction.x).toFixed(2);
    const y = (this.p1.y + alfa * this.direction.y).toFixed(2);
    const z = (this.p1.z + alfa * this.direction.z).toFixed(2);

    if (x == Infinity || y == Infinity || z == Infinity) {
      return false;
    }

    return new Point(x, y, z);
  }

  pointInLine = (p) => {
    const p2 = this.getPointUsingX(p.x);

    if (p.x === p2.x && p.y === p2.y && p.z === p2.z) {
      return true;
    }

    return false;
  };
}
