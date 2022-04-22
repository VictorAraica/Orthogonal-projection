class Plane {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    let v1 = this.p1.vector.sub(this.p2.vector);
    let v2 = this.p3.vector.sub(this.p2.vector);

    this.n = v1.cross(v2);

    this.equation = {
      x: this.n.x,
      y: this.n.y,
      z: this.n.z,
      d: -this.n.x * p1.x - this.n.y * p1.y - this.n.z * p1.z,
    };
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

    console.log(y);

    return new Point(x, y, z);
  }

  getPointUsingYZ(y, z) {
    const x =
      (-this.equation.d - this.equation.y * y - this.equation.z * z) /
      this.equation.x;

    return new Point(x, y, z);
  }
}
