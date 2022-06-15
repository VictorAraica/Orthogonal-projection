class ControlPanel {
  constructor(controlsContainer, addButton, board) {
    this.controlsContainer = controlsContainer;
    this.addButton = addButton;
    this.inputs = [];
    this.functions = [
      "intersection",
      "parallel",
      "perpendicularLine",
      "segment",
      "perpendicularPlane",
      "trazaH",
      "trazaV",
    ];
    this.board = board;

    this.board.xLimit = controlsContainer.offsetWidth;

    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.className = "w-full text-lg p-2 outline-none";

    this.inputContainer = document.createElement("div");
    this.inputContainer.className =
      "border-b border-gray-600 flex justify-center content-center items-center";

    this.inputVisibilityElement = document.createElement("div");
    this.inputVisibilityElement.className =
      "rounded-full border-2 border-black bg-black w-5 h-5 m-2 cursor-pointer bg-opacity-70";

    this.addButton.onclick = () => {
      this.createInput("");
    };

    let commands = [
      "p1 = (2, 3, 4)",
      "p2 = (5, 6, 1)",
      "p3 = (3, 8, 4)",
      "plane = (p1, p2, p3)",
      "l = (p2, p3)",
      "aux1 = perpendicularLine(p1, l)",
      "A = intersection(l, aux1)",
      "aris1 = parallel(p2, aux1)",
      "aris2 = perpendicularLine(plane, A)",
      "p4 = (10, 8, 3)",
      "plane2 = parallel(p4, plane)",
      "B = intersection(plane2, aris2)",
      "aris3 = parallel(aris2, p2)",
      "C = intersection(plane2, aris3)",
      "aris4 = parallel(l, p1)",
      "D = intersection(aris4, aris1)",
      "aris5 = parallel(D, aris3)",
      "E = intersection(plane2, aris5)",
      "aris6 = parallel(p1, aris3)",
      "F = intersection(plane2, aris6)",
      "a1 = segment(p1, A)",
      "a2 = segment(p1, D)",
      "a3 = segment(p1, F)",
      "a4 = segment(p2, D)",
      "a5 = segment(p2, A)",
      "a6 = segment(p2, C)",
      "a7 = segment(A, B)",
      "a8 = segment(B, C)",
      "a9 = segment(B, F)",
      "a10 = segment(E, F)",
      "a11 = segment(E, D)",
      "a12 = segment(E, C)",

      // "p1 = (3, 3, 3)",
      // "p2 = (4, 3, 3)",
      // "p3 = (3, 4, 3)",
      // "p4 = (3, 3, 4)",
      // "p5 = (3, 4, 4)",
      // "p6 = (4, 4, 4)",
      // "p7 = (4, 3, 4)",
      // "p8 = (4, 4, 3)",
      // "l1 = segment(p1, p2)",
      // "l2 = segment(p1, p3)",
      // "l3 = segment(p3, p5)",
      // "l4 = segment(p1, p4)",
      // "l5 = segment(p2, p7)",
      // "l6 = segment(p2, p8)",
      // "l7 = segment(p3, p8)",
      // "l9 = segment(p4, p5)",
      // "l10 = segment(p4, p7)",
      // "l11 = segment(p5, p6)",
      // "l12 = segment(p6, p7)",
      // "l13 = segment(p6, p8)",
    ];

    for (let command of commands) {
      this.createInput(command);
    }

    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].input.value = commands[i];
      this.updateInput(i);
    }
  }

  visibilityToggle(e, index) {
    if (this.inputs[index].shape.show) {
      this.inputs[index].shape.show = false;
      this.inputs[index].show = false;
      e.target.className = e.target.className.replace(
        "bg-opacity-70",
        "bg-opacity-10"
      );
    } else {
      this.inputs[index].shape.show = true;
      this.inputs[index].show = true;
      e.target.className = e.target.className.replace(
        "bg-opacity-10",
        "bg-opacity-70"
      );
    }
  }

  addDependencies(index, dependencies) {
    for (let i of dependencies) {
      if (!i.dependencies.includes(index)) {
        i.dependencies.push(index);
      }
    }
  }

  textToShape(data, index) {
    let shape;

    // if 3 numbers create point
    if (data.length === 3 && data.every((i) => !isNaN(i))) {
      shape = new Point(
        parseFloat(data[0]),
        parseFloat(data[1]),
        parseFloat(data[2])
      );
    } else if (data.length === 2) {
      const shape1 = this.inputs.find((element) => element.name === data[0]);
      const shape2 = this.inputs.find((element) => element.name === data[1]);

      if (!shape1 || !shape2) {
        return false;
      }

      // if two points create line
      if (shape1.shape.type === "point" && shape2.shape.type === "point") {
        shape = new Line(shape1.shape, shape2.shape);
      }
      // add dependencies to the points
      this.addDependencies(index, [shape1, shape2]);
    } else if (data.length === 3) {
      const shape1 = this.inputs.find((element) => element.name === data[0]);
      const shape2 = this.inputs.find((element) => element.name === data[1]);
      const shape3 = this.inputs.find((element) => element.name === data[2]);
      if (!shape1 || !shape2 || !shape3) {
        return false;
      }

      // if 3 points create plane
      if (
        shape1.shape.type === shape2.shape.type &&
        shape2.shape.type === shape3.shape.type &&
        shape1.shape.type === "point"
      ) {
        let line = new Line(shape1.shape, shape2.shape);
        if (line.pointInLine(shape3.shape)) {
          return false;
        }
        shape = new Plane(shape1.shape, shape2.shape, shape3.shape);

        this.addDependencies(index, [shape1, shape2, shape3]);
      }
    }
    if (!shape) return false;

    return shape;
  }

  intersection(index, input1, input2) {
    let shape;

    if (input1.shape.type === "line" && input2.shape.type === "line") {
      shape = input1.shape.lineIntersection(input2.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "plane") {
      shape = input1.shape.planeIntersection(input2.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "line") {
      shape = input2.shape.planeIntersection(input1.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "plane") {
      shape = input2.shape.planeIntersection(input1.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return false;
  }

  parallel(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "line") {
      shape = input2.shape.parallelLine(input1.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "point") {
      shape = input1.shape.parallelLine(input2.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "point") {
      shape = input1.shape.parallelPlane(input2.shape);
    } else if (input1.shape.type === "point" && input2.shape.type === "plane") {
      shape = input2.shape.parallelPlane(input1.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "plane") {
      shape = input2.shape.planeIntersection(input1.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return false;
  }

  perpendicularLine(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "line") {
      shape = input2.shape.perpendicularLine(input1.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "point") {
      shape = input1.shape.perpendicularLine(input2.shape);
    } else if (input1.shape.type === "point" && input2.shape.type === "plane") {
      shape = input2.shape.perpendicularLine(input1.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "point") {
      shape = input1.shape.perpendicularLine(input2.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return false;
  }

  perpendicularPlane(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "line") {
      shape = input2.shape.perpendicularPlane(input1.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "point") {
      shape = input1.shape.perpendicularPlane(input2.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return false;
  }

  segmentedLine(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "point") {
      shape = new SegmentedLine(input1.shape, input2.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return false;
  }

  trazaH(index, input) {
    let shape = false;
    if (input.shape.type === "line") {
      shape = input.shape.getPointUsingZ(0);
    } else if (input.shape.type === "plane") {
      shape = input.shape.planeIntersection(this.board.PH);
    }
    if (shape) {
      this.addDependencies(index, [input]);
      return shape;
    }
    return false;
  }

  trazaV(index, input) {
    let shape = false;
    if (input.shape.type === "line") {
      shape = input.shape.getPointUsingY(0);
    } else if (input.shape.type === "plane") {
      shape = input.shape.planeIntersection(this.board.PV);
    }

    if (shape) {
      this.addDependencies(index, [input]);
      return shape;
    }
    return false;
  }

  functionToShape(index, functionName, parameters) {
    if (!functionName in this.functions) {
      return false;
    }

    let shape = false;

    let inputs = parameters.map((parameter) => {
      return this.inputs.find((element) => element.name === parameter);
    });

    if (inputs[0] && inputs[1]) {
      if (functionName === "intersection") {
        shape = this.intersection(index, inputs[0], inputs[1]);
      } else if (functionName === "parallel") {
        shape = this.parallel(index, inputs[0], inputs[1]);
      } else if (functionName === "perpendicularLine") {
        shape = this.perpendicularLine(index, inputs[0], inputs[1]);
      } else if (functionName === "perpendicularPlane") {
        shape = this.perpendicularPlane(index, inputs[0], inputs[1]);
      } else if (functionName === "segment") {
        shape = this.segmentedLine(index, inputs[0], inputs[1]);
      }
    } else if (inputs[0]) {
      if (functionName === "trazaH") {
        shape = this.trazaH(index, inputs[0]);
      } else if (functionName === "trazaV") {
        shape = this.trazaV(index, inputs[0]);
      }
    }

    return shape;
  }

  getNameAndData(value) {
    value = value.replace(/ /g, "");

    const splited = value.split("=");

    if (splited.length !== 2) {
      return [false, false];
    }

    return splited;
  }

  blurError(element, error) {
    this.board.shapes[element.input.index] = false;
    element.input.value = "";
    element.input.placeholder = error;
  }

  updateInput(index) {
    let element = this.inputs[index];
    let value = element.input.value;

    if (value === "") {
      element.shape = "";
      element.name = "";
      element.command = "";
      element.input.placeholder = "";
      this.board.shapes[index] = false;
      // element.shape = false;
      if (element.dependencies) {
        for (let i of element.dependencies) {
          this.updateInput(i);
        }
      }
      element.dependencies = [];
    }

    // ---------------------------------------------

    // split on = and get name and data
    let [name, data] = this.getNameAndData(value);

    // if no data delete input value and return
    if (!data) {
      // TODO
      this.blurError(element, "");
      return false;
    }

    // ---------------------------------------------

    let sameNameElem = this.inputs.find((element) => element.name === name);

    if (sameNameElem) {
      if (sameNameElem.input.index !== index) {
        this.blurError(element, "name already used");
        return false;
      }
    }

    // ---------------------------------------------
    let shape = false;

    const functionRegex = /\w+\(\.*,?.*?\,?\.*?\)/;
    if (data.match(functionRegex)) {
      let [functionName, parameters] = data.replace(/\)/g, "").split("(");
      parameters = parameters.split(",");

      shape = this.functionToShape(index, functionName, parameters);

      if (!shape) {
        this.blurError(element, "error");
        return false;
      }

      element.command = `${name} = ${functionName}(${parameters.join(", ")})`;
    }
    // ---------------------------------------------

    if (!shape) {
      data = data.replace(/\(|\)/g, "").split(",");

      if (data.length > 3 && data.length < 2) {
        this.blurError(element, "expected 2 or 3 arguments");
        return false;
      }

      shape = this.textToShape(data, index);

      if (!shape) {
        this.blurError(element, "error");
        return false;
      }

      element.command = `${name} = (${data.join(", ")})`;
    }

    // ---------------------------------------------

    if (sameNameElem) {
      this.board.shapes.splice(sameNameElem.input.index, 1);
    }

    if (!element.show) {
      shape.show = false;
    }

    element.shape = shape;
    element.name = name;

    element.input.value = element.command;
    element.input.placeholder = "";
    this.board.addShape(shape, index);

    for (let i of element.dependencies) {
      this.updateInput(i);
    }
    return shape;
  }

  createInput(command) {
    let input = this.inputElement.cloneNode(true);
    let inputContainer = this.inputContainer.cloneNode(true);
    let inputVisibilityElement = this.inputVisibilityElement.cloneNode(true);
    input.addEventListener("blur", (e) => this.updateInput(e.target.index));
    input.index = this.inputs.length;

    inputVisibilityElement.index = this.inputs.length;
    inputVisibilityElement.addEventListener("click", (e) =>
      this.visibilityToggle(e, input.index)
    );

    inputContainer.appendChild(inputVisibilityElement);
    inputContainer.appendChild(input);

    this.controlsContainer.insertBefore(inputContainer, this.addButton);
    this.inputs.push({ input, dependencies: [], command: command, show: true });
    input.focus();

    return input;
  }
}
