class Polygon {
  constructor(sides, plane, center, vertex) {
    this.type = "polygon";
    this.points = [];
    this.lines = [];
    let v = vertex.vector.copy().sub(center.vector);
    let axis = plane.n.copy().normalize();
    let rotatedVector;
    let angle = (2 * PI) / sides;

    for (let i = 0; i < sides; i++) {
      if (i > 0) {
        v = rotatedVector;
      }

      let a = v.copy().mult(cos(angle));
      let b = axis
        .copy()
        .mult(v.copy().dot(axis))
        .mult(1 - cos(angle));
      let c = axis.copy().cross(v).mult(sin(angle));

      rotatedVector = a.add(b).add(c);

      this.points.push(new Point(center.vector.copy().add(rotatedVector)));
    }

    // this.addDependencies(index, [plane, center, vertex]);
    for (let i = 0; i < this.points.length; i++) {
      this.lines.push(
        new SegmentedLine(
          this.points[i],
          this.points[(i + 1) % this.points.length]
        )
      );
    }

    this.show = true;
    this.color = [255, 255, 255];
    this.alpha = 1;
    this.width = 2;
  }
}
