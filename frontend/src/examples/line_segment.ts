// test 1

let numSegments = 10;

const geometry = new $.BufferGeometry();

const vertices = [];

for (let i = 0; i < numSegments + 1; i++) {
  for (let j = 0; j < numSegments; j++) {
    vertices.push(j, i, 0);
    vertices.push(j + 1, i, 0);
  }
}

for (let i = 0; i < numSegments; i++) {
  for (let j = 0; j < numSegments + 1; j++) {
    vertices.push(j, i, 0);
    vertices.push(j, i + 1, 0);
  }
}

const positions = new Float32Array(vertices);

geometry.setAttribute("position", new $.BufferAttribute(positions, 3));

const material = new $.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1
});

const lines = new $.LineSegments(geometry, material);


// test 2

let nSegmentsVertical = 8;
let nSegmentsHorizontal = 6;

const geometry = new $.BufferGeometry();

const vertices = [];

for (let i = 0; i < nSegmentsHorizontal + 1; i++) {
  for (let j = 0; j < nSegmentsHorizontal; j++) {
    vertices.push(j*3, i, 0);
    vertices.push(j*3, i+4, 0);
  }
}

// Thêm đỉnh của các đường dọc
for (let i = 0; i < nSegmentsVertical; i++) {
  for (let j = 0; j < nSegmentsVertical + 1; j++) {
    vertices.push(i, j, 0);
    vertices.push(i+10, j, 0);
  }
}

const positions = new Float32Array(vertices);

geometry.setAttribute("position", new $.BufferAttribute(positions, 3));

const material = new $.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 1
});

const lines = new $.LineSegments(geometry, material);

this.group.add(lines);