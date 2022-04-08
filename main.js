let board;

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board();

  point1 = new Point(2, 2, 3);
  point2 = new Point(8, 7, 3);
  line1 = new Line(point1, point2);

  board.addEvent(() => board.drawPoint(point1, (rad = 8)));
  board.addEvent(() => board.drawPoint(point2, (rad = 8)));
  board.addEvent(() => board.drawPoint(line1.getPointUsingZ(0), (rad = 8)));
  // board.addEvent(() => board.drawSegmentedLine(line1));
  board.addEvent(() => board.drawLine(line1));
}

function draw() {
  background(0);
  board.drawBackground();
  // board.drawLT();
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
