class Board {
  constructor(cellSize = 40) {
    this.cellSize = cellSize;
    this.camera_x = 0.5;
    this.camera_y = -(windowHeight / cellSize / 2);
    this.scrolling = false;
  }

  draw_background() {
    stroke(50, 50, 50);
    strokeWeight(1);
    for (
      let i = (this.camera_x % 1) * this.cellSize;
      i < windowWidth;
      i = i + this.cellSize
    ) {
      line(i, 0, i, windowHeight);
    }

    for (
      let i = windowHeight - (this.camera_y % 1) * this.cellSize;
      i > 0;
      i = i - this.cellSize
    ) {
      line(0, i, windowWidth, i);
    }
  }
}
