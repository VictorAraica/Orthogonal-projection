let board;

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board();
  point1 = new Point(5, 5, 3);
  board.addEvent(() => board.drawPoint(point1));
}

function draw() {
  background(0);
  board.draw_background();
  board.runEvents();
}

function mouseDragged() {
  board.moveCameraPos();
}

function mouseClicked() {
  board.test();
}

function mouseWheel(e) {
  board.zoom(e);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
