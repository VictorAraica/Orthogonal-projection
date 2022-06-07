intersectionPlaneLine = (line, plane) => {
  let alfaTop =
    plane.equation.x * line.p1.x +
    plane.equation.y * line.p1.y +
    plane.equation.z * line.p1.z +
    plane.equation.d;

  let alfaBot = -(
    plane.equation.x * line.direction.x +
    plane.equation.y * line.direction.y +
    plane.equation.z * line.direction.z
  );

  let alfa = alfaTop / alfaBot;

  const x = line.p1.x + alfa * line.direction.x;
  const y = line.p1.y + alfa * line.direction.y;
  const z = line.p1.z + alfa * line.direction.z;

  if (x === Infinity || y === Infinity || z === Infinity) {
    return false;
  }

  return new Point(x, y, z);
};
