class Board {
  constructor(cellSize = 43) {
    this.cellSize = cellSize;
    this.cameraPos = createVector(10, windowHeight / this.cellSize / 2);
    this.shapes = [];
  }

  test() {
  }

  addShape(shape, index) {
    this.shapes.splice(index, 0, shape);
  }

  addShapes(shapes) {
    this.shapes.push(...shapes);
  }

  draw(shape) {
    if (shape.type === "point" && shape.show) {
      this.drawPoint(shape);
    } else if (shape.type === "line" && shape.show) {
      this.drawLine(shape);
    } else if (shape.type === "segmented line" && shape.show) {
      this.drawSegmentedLine(shape);
    }
    // if (shape.type === "plane") {
    //  this.drawPlane(shape)
    // }
  }

  drawShapes() {
    // draw shapes in the list
    for (let shape of this.shapes) {
      this.draw(shape);
    }
  }

  moveCameraPos() {
    // move the camera depending on the mouse drag
    const dif = this.pixelToScale(mouseX, mouseY).sub(
      this.pixelToScale(pmouseX, pmouseY)
    );

    this.cameraPos.add(dif);
  }

  zoom(e) {
    if (e.deltaY > 0) {
      this.cellSize *= 0.9;
    } else {
      this.cellSize *= 1.1;
    }
  }

  pixelToScale(x, y) {
    // pixel position to real position
    const scaleX = x / this.cellSize - this.cameraPos.x;
    const scaleY = y / this.cellSize - this.cameraPos.y;

    return createVector(scaleX, scaleY, -scaleY);
  }

  scaleToPixel(x, y) {
    // real position to pixel position
    const pixelX = x * this.cellSize + this.cameraPos.x * this.cellSize;

    const pixelY = y * this.cellSize + this.cameraPos.y * this.cellSize;

    return createVector(pixelX, pixelY);
  }

  drawBackground() {
    // draw background grid and lt
    stroke(50, 50, 50);
    strokeWeight(1);

    for (
      // % 1 to start the lines in the offset
      let i = (this.cameraPos.x % 1) * this.cellSize;
      i < windowWidth;
      i += this.cellSize
    ) {
      line(i, 0, i, windowHeight);
    }

    for (
      let i = (this.cameraPos.y % 1) * this.cellSize;
      i < windowHeight;
      i += this.cellSize
    ) {
      line(0, i, windowWidth, i);
    }

    this.drawLT();
  }

  drawLT() {
    // draw earth line
    stroke(250, 250, 250);
    strokeWeight(3);
    origin = this.scaleToPixel(0, 0);

    line(0, origin.y, windowWidth, origin.y);
    line(origin.x, origin.y + 15, origin.x, origin.y - 15);
  }

  drawPoint(p) {
    if (typeof p !== "object" || p === null) {
      return false;
    }

    const PH = this.scaleToPixel(p.x, p.y);
    const PV = this.scaleToPixel(p.x, -p.z);

    let color = p.color;
    let rad = p.rad;

    if (this.distanceMousePoint(p) * this.cellSize < 10) {
      color = [0, 255, 0];
      rad *= 1.5;
    }

    stroke(...color);
    strokeWeight(rad);

    point(PH);
    point(PV);
  }

  drawSegmentedLine(l) {
    if (typeof l !== "object" || l === null) {
      return false;
    }

    const PH1 = this.scaleToPixel(l.p1.x, l.p1.y);
    const PH2 = this.scaleToPixel(l.p2.x, l.p2.y);
    const PV1 = this.scaleToPixel(l.p1.x, -l.p1.z);
    const PV2 = this.scaleToPixel(l.p2.x, -l.p2.z);

    let color = l.color;
    let width = l.width;

    // const mousePos = this.pixelToScale(pmouseX, pmouseY);
    // if (this.distanceMousePoint(p) * this.cellSize < 10 && mousePos.x) {
    //   color = [0, 255, 0];
    //   rad *= 1.5;
    // }

    strokeWeight(width);
    stroke(...color);

    line(PH1.x, PH1.y, PH2.x, PH2.y);
    line(PV1.x, PV1.y, PV2.x, PV2.y);
  }

  drawLine(l) {
    if (typeof l !== "object" || l === null) {
      return false;
    }

    let color = l.color;
    let width = l.width;

    if (this.distanceMouseLine(l) * this.cellSize < 10) {
      color = [0, 255, 0];
      width *= 2;
    }

    const PH1 = this.scaleToPixel(l.p1.x, l.p1.y);
    const PH2 = this.scaleToPixel(l.p2.x, l.p2.y);
    const PV1 = this.scaleToPixel(l.p1.x, -l.p1.z);
    const PV2 = this.scaleToPixel(l.p2.x, -l.p2.z);

    strokeWeight(width);
    stroke(...color);

    line(...this.getLineBorderPoints(PH1, PH2));
    line(...this.getLineBorderPoints(PV1, PV2));
  }

  getLineBorderPoints(p1, p2) {
    const m = (p1.y - p2.y) / (p1.x - p2.x);

    if (abs(m) === Infinity) {
      return [p1.x, 0, p1.x, windowHeight];
    }
    const y1 = -m * p1.x + p1.y;
    const y2 = m * windowWidth - m * p1.x + p1.y;

    return [0, y1, windowWidth, y2];
  }

  distanceMousePoint(p) {
    const mousePos = this.pixelToScale(pmouseX, pmouseY);
    const distY = Math.sqrt((p.x - mousePos.x) ** 2 + (p.y - mousePos.y) ** 2);
    const distZ = Math.sqrt((p.x - mousePos.x) ** 2 + (p.z - mousePos.z) ** 2);
    return Math.min(distY, distZ);
  }

  distanceMouseLine(l) {
    const mousePos = this.pixelToScale(pmouseX, pmouseY);

    const distY =
      Math.abs(
        l.equationY.a * mousePos.x + l.equationY.b * mousePos.y + l.equationY.c
      ) / Math.sqrt(l.equationY.a ** 2 + l.equationY.b ** 2);

    const distZ =
      Math.abs(
        l.equationZ.a * mousePos.x + l.equationZ.b * mousePos.z + l.equationZ.c
      ) / Math.sqrt(l.equationZ.a ** 2 + l.equationZ.b ** 2);

    return Math.min(distY, distZ);
  }
}
