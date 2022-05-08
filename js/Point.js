class Point {
  constructor(...args) {
    this.type = "point";
    if (
      typeof args[0] === "number" &&
      typeof args[1] === "number" &&
      typeof args[2] === "number"
    ) {
      this.x = args[0];
      this.y = args[1];
      this.z = args[2];
      this.vector = createVector(this.x, this.y, this.z);
    } else if (
      typeof args[0].x === "number" &&
      typeof args[0].y === "number" &&
      typeof args[0].z === "number"
    ) {
      this.x = args[0].x;
      this.y = args[0].y;
      this.z = args[0].z;
      this.vector = args[0];
    }
    this.show = true;

    this.rad = 7;
    this.color = [255, 255, 255];
  }
}
