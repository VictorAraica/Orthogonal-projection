class Cone {
  constructor(vertex, plane, center, generatriz, cellSize = 52) {
    this.type = "cone";
    this.vertex = vertex;
    this.base = new Polygon(30, plane, center, generatriz);

    let biggerAnglePH = 0;
    let biggerAnglePV = 0;
    let PVPoints = [0, 0];
    let PHPoints = [0, 0];
    for (let i = 0; i < this.base.points.length - 1; i++) {
      for (let j = 0; j < this.base.points.length; j++) {
        let anglePH = this.angleBetweenPH(
          this.base.points[i],
          this.vertex,
          this.base.points[j],
          this.vertex
        );
        let anglePV = this.angleBetweenPV(
          this.base.points[i],
          this.vertex,
          this.base.points[j],
          this.vertex
        );

        if (anglePH > biggerAnglePH) {
          biggerAnglePH = anglePH;
          PHPoints = [i, j];

          if (degrees(anglePH) > 172) {
            PHPoints = false;
          }
        }

        if (anglePV > biggerAnglePV) {
          biggerAnglePV = anglePV;
          PVPoints = [i, j];

          if (degrees(anglePV) > 174) {
            PVPoints = false;
          }
        }
      }
    }

    if (PHPoints) {
      this.PHLines = [
        new SegmentedLine(vertex, this.base.points[PHPoints[0]]),
        new SegmentedLine(vertex, this.base.points[PHPoints[1]]),
      ];
    }

    if (PVPoints) {
      this.PVLines = [
        new SegmentedLine(vertex, this.base.points[PVPoints[0]]),
        new SegmentedLine(vertex, this.base.points[PVPoints[1]]),
      ];
    }

    this.show = true;
    this.color = [250, 250, 250, 40];
    this.width = 2;

    this.model = this.createModel(cellSize);
  }

  angleBetweenPH(p1, p2, p3, p4) {
    let v1 = createVector(p1.x - p2.x, p1.y - p2.y);
    let v2 = createVector(p3.x - p4.x, p3.y - p4.y);

    return v1.angleBetween(v2);
  }

  angleBetweenPV(p1, p2, p3, p4) {
    let v1 = createVector(p1.x - p2.x, p1.z - p2.z);
    let v2 = createVector(p3.x - p4.x, p3.z - p4.z);

    return v1.angleBetween(v2);
  }

  createModel(cellSize = 52) {
    let points = this.base.points;
    let center = this.base.center;
    let vertex = this.vertex;
    return new p5.Geometry(
      1,
      1,
      // The callback must be an anonymous function, not an arrow function in
      // order for "this" to be bound correctly.
      function createGeometry() {
        let centerVector = createVector(
          center.x * cellSize,
          -center.z * cellSize,
          center.y * cellSize
        );

        let vertexVector = createVector(
          vertex.x * cellSize,
          -vertex.z * cellSize,
          vertex.y * cellSize
        );

        let vertices = points.map((p) =>
          createVector(p.x * cellSize, -p.z * cellSize, p.y * cellSize)
        );

        this.vertices.push(...vertices);
        this.vertices.push(centerVector);
        this.vertices.push(vertexVector);

        for (let i = 0; i < points.length; i++) {
          this.faces.push([i, (i + 1) % points.length, vertices.length + 1]);
          this.faces.push([i, (i + 1) % points.length, vertices.length]);
        }

        this.gid = Math.random().toString(16).slice(2);
      }
    );
  }
}
