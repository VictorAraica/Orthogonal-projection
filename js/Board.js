class Board {
  constructor(cellSize = 52) {
    this.cellSize = cellSize;
    this.cellSizeWEBGL = cellSize;
    this.cameraPos = createVector(8, windowHeight / this.cellSize / 2);
    this.shapes = [];
    this.xLimit = 0;
    this.WEBGL = false;
    this.rotateXWEBGL = 0;
    this.rotateYWEBGL = 0;
    this.translateXWEBGL =
      -windowWidth / 2 + controlsContainer.offsetWidth + windowWidth * 0.1;
    this.translateYWEBGL = windowHeight / 4;
    this.translateZWEBGL = 0;
    this.orthoWEBGL = true;
    this.origin = new Point(0, 0, 0);
    this.PV = new Plane(this.origin, new Point(2, 0, 1), new Point(3, 0, 5));
    this.PH = new Plane(this.origin, new Point(2, 1, 0), new Point(3, 6, 0));
  }

  drawPoint(p, color = undefined) {
    if (typeof p !== "object" || p === null) {
      return false;
    }

    const PH = this.scaleToPixel(p.x, p.y);
    const PV = this.scaleToPixel(p.x, -p.z);

    color = color ? color : p.color;

    color = this.alphaToColor(color);

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

  drawSegmentedLine(l, PH = true, PV = true, color = undefined) {
    if (typeof l !== "object" || l === null) {
      return false;
    }

    color = color ? color : l.color;

    color = this.alphaToColor(color);

    const PH1 = this.scaleToPixel(l.p1.x, l.p1.y);
    const PH2 = this.scaleToPixel(l.p2.x, l.p2.y);
    const PV1 = this.scaleToPixel(l.p1.x, -l.p1.z);
    const PV2 = this.scaleToPixel(l.p2.x, -l.p2.z);

    let width = l.width;

    const mousePos = this.pixelToScale(pmouseX, pmouseY);

    const p1 = l.p1;
    const p2 = l.p2;

    if (
      this.distanceMouseLine(l) * this.cellSize < 10 &&
      ((p1.x < mousePos.x && mousePos.x < p2.x) ||
        (p2.x < mousePos.x && mousePos.x < p1.x))
    ) {
      color = [0, 255, 0];
      width *= 2;
    }

    strokeWeight(width);
    stroke(...color);

    if (PH) line(PH1.x, PH1.y, PH2.x, PH2.y);
    if (PV) line(PV1.x, PV1.y, PV2.x, PV2.y);
  }

  drawLine(l, color = undefined) {
    if (typeof l !== "object" || l === null) {
      return false;
    }

    color = color ? color : l.color;

    color = this.alphaToColor(color);

    let width = l.width;

    if (this.distanceMouseLine(l) * this.cellSize < 10) {
      color = [0, 255, 0, 20];
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

  drawPolygon(shape, color = undefined) {
    color = color ? color : shape.color;

    for (let line of shape.lines) {
      this.drawSegmentedLine(line, true, true, color);
    }
  }

  drawPyramid(p, color = undefined) {
    color = color ? color : p.color;

    for (let l of p.edges) {
      this.drawSegmentedLine(l, true, true, color);
    }
  }

  drawCone(c, color = undefined) {
    color = color ? color : c.color;
    this.drawPolygon(c.base, color);

    for (let l of c.PHLines) {
      this.drawSegmentedLine(l, true, false, color);
    }

    for (let l of c.PVLines) {
      this.drawSegmentedLine(l, false, true, color);
    }
  }

  drawPointWEBGL(p, color = undefined) {
    if (typeof p !== "object" || p === null) {
      return false;
    }

    const x = p.x * this.cellSizeWEBGL;
    // y = z because in webgl y is the cota and up is negative
    const y = -p.z * this.cellSizeWEBGL;
    const z = p.y * this.cellSizeWEBGL;

    color = color ? color : p.color;
    color = this.alphaToColor(color);

    let rad = p.rad;

    stroke(...color);
    strokeWeight(rad * 1.5);

    point(x, y, z);
  }

  drawLineWEBGL(l, color = undefined) {
    let p1;
    let p2;
    if (typeof l !== "object" || l === null) {
      return false;
    }

    color = color ? color : l.color;
    color = this.alphaToColor(color);

    let width = l.width;

    if (l.p1.x !== l.p2.x) {
      p1 = l.getPointUsingX(50);
      p2 = l.getPointUsingX(-50);
    } else if (l.p1.y !== l.p2.y) {
      p1 = l.getPointUsingY(50);
      p2 = l.getPointUsingY(-50);
    } else if (l.p1.z !== l.p2.z) {
      p1 = l.getPointUsingZ(50);
      p2 = l.getPointUsingZ(-50);
    }

    const x1 = p1.x * this.cellSizeWEBGL;
    // y = z because in webgl y is the cota and up is negative
    const y1 = -p1.z * this.cellSizeWEBGL;
    const z1 = p1.y * this.cellSizeWEBGL;

    const x2 = p2.x * this.cellSizeWEBGL;
    // y = z because in webgl y is the cota and up is negative
    const y2 = -p2.z * this.cellSizeWEBGL;
    const z2 = p2.y * this.cellSizeWEBGL;
    2;

    strokeWeight(width);
    stroke(...color);

    line(x1, y1, z1, x2, y2, z2);
  }

  drawSegmentedLineWEBGL(l, color = undefined) {
    if (typeof l !== "object" || l === null) {
      return false;
    }

    color = color ? color : l.color;
    color = this.alphaToColor(color);

    let width = l.width;

    const x1 = l.p1.x * this.cellSizeWEBGL;
    // y = z because in webgl y is the cota and up is negative
    const y1 = -l.p1.z * this.cellSizeWEBGL;
    const z1 = l.p1.y * this.cellSizeWEBGL;

    const x2 = l.p2.x * this.cellSizeWEBGL;
    // y = z because in webgl y is the cota and up is negative
    const y2 = -l.p2.z * this.cellSizeWEBGL;
    const z2 = l.p2.y * this.cellSizeWEBGL;
    2;

    strokeWeight(width);
    stroke(...color);

    line(x1, y1, z1, x2, y2, z2);
  }

  drawPlaneWEBGL(p, color = undefined) {
    color = color ? color : p.color;

    push();
    strokeWeight(0);
    fill(...color);

    let angle = p.n.angleBetween(createVector(0, 1, 0));
    const rotationAxis = p.n.copy().cross(createVector(0, 1, 0));

    let rotationAxis2 = createVector(
      rotationAxis.x,
      -rotationAxis.z,
      rotationAxis.y
    );

    translate(
      p.p1.x * this.cellSizeWEBGL,
      -p.p1.z * this.cellSizeWEBGL,
      p.p1.y * this.cellSizeWEBGL
    );

    if (angle > 0) {
      angle = -angle;
    }

    if (rotationAxis.x !== 0 || rotationAxis.y !== 0 || rotationAxis.z !== 0) {
      rotate(angle, rotationAxis2);
    }

    plane(this.cellSizeWEBGL * 35, this.cellSizeWEBGL * 35);
    pop();
  }

  drawPolygonWEBGL(shape, color = undefined) {
    color = color ? color : shape.color;

    for (let line of shape.lines) {
      this.drawSegmentedLineWEBGL(line, color);
    }
  }

  drawPyramidWEBGL(p, color = undefined) {
    color = color ? [...color] : [...p.color];

    for (let l of p.edges) {
      this.drawSegmentedLineWEBGL(l, color);
    }

    color[3] = color[3] / 4;

    push();
    strokeWeight(0);
    fill(...color);
    model(p.model);
    pop();
  }

  drawConeWEBGL(c, color = undefined) {
    color = color ? [...color] : [...c.color];
    this.drawPolygonWEBGL(c.base, color);

    color[3] = color[3] / 4;

    push();
    strokeWeight(0);
    fill(...color);
    model(c.model);
    pop();
  }

  drawPV() {
    push();
    const planeWidth = windowHeight * 0.07 + windowWidth / 2;
    const planeHeight = windowHeight * 0.57;
    translate(
      planeWidth / 2 - windowHeight * 0.07,
      -planeHeight / 2 + windowHeight * 0.07
    );
    strokeWeight(0);
    fill(0, 100, 100, 40);
    plane(planeWidth, planeHeight);
    pop();
  }

  drawPH() {
    push();
    const planeWidth = windowHeight * 0.07 + windowWidth / 2;
    const planeHeight = windowHeight * 0.57;
    strokeWeight(0);
    fill(0, 100, 100, 40);
    rotateX(PI / 2);
    translate(
      planeWidth / 2 - windowHeight * 0.07,
      planeHeight / 2 - windowHeight * 0.07
    );
    plane(planeWidth, planeHeight);
    pop();
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

  drawAxisWEBGL() {
    push();
    stroke(255, 0, 0);
    strokeWeight(3);
    line(-windowHeight * 0.07, 0, 0, windowWidth / 2, 0, 0);
    stroke(0, 0, 255);
    line(0, windowHeight * 0.07, 0, 0, -windowHeight / 2, 0);
    stroke(0, 255, 0);
    line(0, 0, -windowHeight * 0.07, 0, 0, windowHeight / 2);
    pop();
  }

  draw(shape) {
    if (shape.type === "point" && shape.show) {
      this.drawPoint(shape);
    } else if (shape.type === "line" && shape.show) {
      this.drawLine(shape);
    } else if (shape.type === "segmented line" && shape.show) {
      this.drawSegmentedLine(shape);
    } else if (shape.type === "polygon" && shape.show) {
      this.drawPolygon(shape);
    } else if (shape.type === "cone" && shape.show) {
      this.drawCone(shape);
    } else if (shape.type === "pyramid" && shape.show) {
      this.drawPyramid(shape);
    }
  }

  drawWEBGL(shape) {
    if (Array.isArray(shape)) {
      for (let i of shape) {
        this.drawWEBGL(i);
      }
    } else if (shape.type === "point" && shape.show) {
      this.drawPointWEBGL(shape);
    } else if (shape.type === "line" && shape.show) {
      this.drawLineWEBGL(shape);
    } else if (shape.type === "segmented line" && shape.show) {
      this.drawSegmentedLineWEBGL(shape);
    } else if (shape.type === "plane" && shape.show) {
      this.drawPlaneWEBGL(shape);
    } else if (shape.type === "polygon" && shape.show) {
      this.drawPolygonWEBGL(shape);
    } else if (shape.type === "cone" && shape.show) {
      this.drawConeWEBGL(shape);
    } else if (shape.type === "pyramid" && shape.show) {
      this.drawPyramidWEBGL(shape);
    }
  }

  drawShapes() {
    // draw shapes in the list
    if (this.WEBGL) {
      // sort array to draw planes last
      let shapes = [...this.shapes];
      shapes.sort((a, b) => {
        if (a.type === "plane") {
          return 1;
        } else {
          return 0;
        }
      });

      for (let shape of shapes) {
        this.drawWEBGL(shape);
      }
    } else {
      for (let shape of this.shapes) {
        this.draw(shape);
      }
    }
  }

  alphaToColor(color) {
    const alpha = [...color].pop();
    color = color.map((x) => x * (alpha / 255));

    return color;
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

  addShape(shape, index) {
    this.shapes.splice(index, 0, shape);
  }

  addShapes(shapes) {
    this.shapes.push(...shapes);
  }

  moveCameraPos() {
    // move the camera depending on the mouse drag
    if (mouseX > this.xLimit) {
      const dif = this.pixelToScale(mouseX, mouseY).sub(
        this.pixelToScale(pmouseX, pmouseY)
      );
      this.cameraPos.add(dif);
    }
  }

  moveCameraPosWEBGL(e) {
    // move the camera depending on the mouse drag
    if (mouseX > this.xLimit) {
      const difX = mouseX - pmouseX;
      const difY = mouseY - pmouseY;
      if (e.ctrlKey || e.buttons === 2) {
        this.translateXWEBGL += difX;
        this.translateYWEBGL += difY;
      } else {
        this.rotateYWEBGL += difX * 0.001;
        this.rotateXWEBGL -= difY * 0.001;
      }
    }
  }

  zoom(e) {
    if (mouseX > this.xLimit) {
      e.preventDefault();
      if (e.deltaY > 0) {
        this.cellSize *= 0.9;
        if (this.cellSize < 18) {
          this.cellSize = 18;
        }
      } else {
        this.cellSize *= 1.1;
      }
    }
  }

  zoomWEBGL(e) {
    if (mouseX > this.xLimit) {
      e.preventDefault();
      if (e.ctrlKey) {
        if (e.deltaY > 0) {
          this.translateZWEBGL -= this.cellSizeWEBGL;
        } else {
          this.translateZWEBGL += this.cellSizeWEBGL;
        }
      } else {
        if (e.deltaY > 0) {
          this.cellSizeWEBGL *= 0.9;
        } else {
          this.cellSizeWEBGL *= 1.1;
        }
      }
      for (let shape of this.shapes) {
        if (shape.type === "cone" || shape.type === "pyramid") {
          shape.model = shape.createModel(this.cellSizeWEBGL);
        }
      }
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
}
