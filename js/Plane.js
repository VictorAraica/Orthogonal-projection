class Plane {
  // p2 can be the normal vector and p1 the point
  constructor(p1, p2, p3 = 0) {
    this.type = "plane";
    if (p1.type === "point" && p2.type === "point" && p3.type === "point") {
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      let line1 = new Line(p1, p2);
      if (line1.pointInLine(p3)) {
        throw Error;
      }

      let v1 = this.p1.vector.copy().sub(this.p2.vector);
      let v2 = this.p3.vector.copy().sub(this.p2.vector);
      this.n = v1.cross(v2);
    } else if (p1.type === "point" && (p2.x || p2.y || p2.z)) {
      this.n = p2;
      this.p1 = p1;
    }

    this.equation = {
      x: this.n.x,
      y: this.n.y,
      z: this.n.z,
      d: -this.n.x * p1.x - this.n.y * p1.y - this.n.z * p1.z,
    };

    this.show = true;
    this.color = [255, 255, 255];
    this.rad = 2;
  }

  getPointUsingXY(x, y) {
    const z =
      (-this.equation.d - this.equation.x * x - this.equation.y * y) /
      this.equation.z;

    return new Point(x, y, z);
  }

  getPointUsingXZ(x, z) {
    const y =
      (-this.equation.d - this.equation.x * x - this.equation.z * z) /
      this.equation.y;

    return new Point(x, y, z);
  }

  getPointUsingYZ(y, z) {
    const x =
      (-this.equation.d - this.equation.y * y - this.equation.z * z) /
      this.equation.x;

    return new Point(x, y, z);
  }

  perpendicularLine(point) {
    let p2 = point.vector.copy().add(this.n);
    let x = p2.x;
    let y = p2.y;
    let z = p2.z;
    return new Line(point, new Point(x, y, z));
  }

  parallelPlane(point) {
    return new Plane(point, this.n);
  }
}
