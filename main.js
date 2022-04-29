let board;

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board();

  p1 = new Point(2, 2, 2);
  p2 = new Point(1, 1, 2);
  // p3 = new Point(2, 2, 4);

  // plane1 = new Plane(p1, p2, p3);

  // p4 = new Point(2, 3, 4);
  // p5 = new Point(6, 5, 4);

  line1 = new Line(p1, p2);

  // intersection = line1.planeIntersection(plane1);

  board.addEvent(() => board.drawLine(line1));
  // board.addEvent(() => board.drawPoint(intersection));
}

function draw() {
  background(0);
  board.drawBackground();
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
