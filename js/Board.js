class Board {
  constructor(cellSize = 43) {
    this.cellSize = cellSize;
    this.cameraPos = createVector(1, windowHeight / this.cellSize / 2);
  }

  moveCameraPos() {
    let dif = this.pixelToScale(mouseX, mouseY).sub(
      this.pixelToScale(pmouseX, pmouseY)
    );

    this.cameraPos.add(dif);
  }

  test() {
    
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
    let scaleX = x / this.cellSize - this.cameraPos.x;
    let scaleY = y / this.cellSize - this.cameraPos.y;

    return createVector(scaleX, scaleY);
  }

  scaleToPixel(x, y) {
    // real position to pixel position
    let pixelX = x * this.cellSize + this.cameraPos.x * this.cellSize;

    let pixelY = y * this.cellSize + this.cameraPos.y * this.cellSize;

    return createVector(pixelX, pixelY);
  }

  draw_background() {
    // draw background grid and lt
    stroke(50, 50, 50);
    strokeWeight(1);

    for (
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

    this.draw_lt();
  }

  draw_lt() {
    // draw earth line
    stroke(250, 250, 250);
    strokeWeight(3);
    origin = this.scaleToPixel(0, 0);

    line(0, origin.y, windowWidth, origin.y);
    line(origin.x, origin.y + 15, origin.x, origin.y - 15);
  }
}
