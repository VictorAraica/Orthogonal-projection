class Pyramid {
  constructor(sides, vertex, plane, center, generatriz, cellSize = 52) {
    this.type = "pyramid";
    this.vertex = vertex;
    this.sides = sides;
    this.base = new Polygon(sides, plane, center, generatriz);
    this.edges = [...this.base.lines];

    for (let p of this.base.points) {
      this.edges.push(new SegmentedLine(p, vertex));
    }

    this.model = this.createModel(cellSize);

    this.color = [250, 250, 250, 255];
    this.show = true;
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
