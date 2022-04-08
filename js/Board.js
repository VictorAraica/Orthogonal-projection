class Board {
  constructor(cellSize = 43) {
    this.cellSize = cellSize;
    this.cameraPos = createVector(1, windowHeight / this.cellSize / 2);
    this.events = [];
  }

  test() {}
  runEvents() {
    // run the events in the list
    for (let event of this.events) {
      event();
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

    return createVector(scaleX, scaleY);
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

  drawPoint(p, rad = 5, color = 255) {
    const PH = this.scaleToPixel(p.x, p.y);
    const PV = this.scaleToPixel(p.x, -p.z);

    strokeWeight(rad);
    stroke(color);

    point(PH);
    point(PV);
  }

  drawSegmentedLine(l, width = 2, color = 255) {
    const PH1 = this.scaleToPixel(l.p1.x, l.p1.y);
    const PH2 = this.scaleToPixel(l.p2.x, l.p2.y);
    const PV1 = this.scaleToPixel(l.p1.x, -l.p1.z);
    const PV2 = this.scaleToPixel(l.p2.x, -l.p2.z);

    strokeWeight(width);
    stroke(color);

    line(PH1.x, PH1.y, PH2.x, PH2.y);
    line(PV1.x, PV1.y, PV2.x, PV2.y);
  }

  drawLine(l, width = 2, color = 255) {
    const PH1 = this.scaleToPixel(l.p1.x, l.p1.y);
    const PH2 = this.scaleToPixel(l.p2.x, l.p2.y);
    const PV1 = this.scaleToPixel(l.p1.x, -l.p1.z);
    const PV2 = this.scaleToPixel(l.p2.x, -l.p2.z);

    strokeWeight(width);
    stroke(color);

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

  addEvent(e) {
    this.events.push(e);
  }
}
