export type Vec4 = [number, number, number, number];
export type Vec3 = [number, number, number];
export type Rotation4 = [number, number, number];
export type ShapeKind = 'tesseract' | 'hypersphere' | 'simplex' | 'orthoplex';

export interface Slice3D {
  points: Vec3[];
  radius?: number;
}

type Edge = [number, number];
type Polytope = { vertices: Vec4[]; edges: Edge[] };

const tesseract: Polytope = {
  vertices: Array.from({ length: 16 }, (_, bits) =>
    Array.from({ length: 4 }, (_, axis) => (bits & (1 << axis) ? 0.5 : -0.5)) as Vec4,
  ),
  edges: [],
};
for (let vertex = 0; vertex < 16; vertex += 1) {
  for (let axis = 0; axis < 4; axis += 1) {
    const neighbor = vertex ^ (1 << axis);
    if (vertex < neighbor) tesseract.edges.push([vertex, neighbor]);
  }
}

const orthoplex: Polytope = {
  vertices: Array.from({ length: 8 }, (_, index) => {
    const vertex: Vec4 = [0, 0, 0, 0];
    vertex[Math.floor(index / 2)] = index % 2 === 0 ? 1 : -1;
    return vertex;
  }),
  edges: [],
};
for (let first = 0; first < 8; first += 1) {
  for (let second = first + 1; second < 8; second += 1) {
    if (Math.floor(first / 2) !== Math.floor(second / 2)) orthoplex.edges.push([first, second]);
  }
}

const a = Math.sqrt(5) / 4;
const simplex: Polytope = {
  vertices: [
    [a, a, a, 0.25], [a, -a, -a, 0.25], [-a, a, -a, 0.25],
    [-a, -a, a, 0.25], [0, 0, 0, -1],
  ],
  edges: [],
};
for (let first = 0; first < 5; first += 1) {
  for (let second = first + 1; second < 5; second += 1) simplex.edges.push([first, second]);
}

const polytopes = { tesseract, simplex, orthoplex };

export function rotate4D(vertex: Vec4, angles: Rotation4): Vec4 {
  const result: Vec4 = [...vertex];
  for (let axis = 0; axis < 3; axis += 1) {
    const c = Math.cos(angles[axis]);
    const s = Math.sin(angles[axis]);
    const spatial = result[axis];
    result[axis] = spatial * c - result[3] * s;
    result[3] = spatial * s + result[3] * c;
  }
  return result;
}

export function shapeVertices(kind: ShapeKind, size: number, rotation: Rotation4): Vec4[] {
  if (kind === 'hypersphere') return [];
  return polytopes[kind].vertices.map((vertex) =>
    rotate4D(vertex.map((coordinate) => coordinate * size) as Vec4, rotation),
  );
}

const distanceSquared = (a3: Vec3, b3: Vec3): number =>
  (a3[0] - b3[0]) ** 2 + (a3[1] - b3[1]) ** 2 + (a3[2] - b3[2]) ** 2;

export function sliceShape(
  kind: ShapeKind,
  size: number,
  rotation: Rotation4,
  sliceW: number,
): Slice3D {
  if (size <= 0 || !Number.isFinite(size) || !Number.isFinite(sliceW) || rotation.some((v) => !Number.isFinite(v))) {
    return { points: [] };
  }
  if (kind === 'hypersphere') {
    if (Math.abs(sliceW) > size) return { points: [] };
    return { points: [], radius: Math.sqrt((size - Math.abs(sliceW)) * (size + Math.abs(sliceW))) };
  }

  const epsilon = size * 1e-8;
  const points: Vec3[] = [];
  const add = (point: Vec3): void => {
    if (!points.some((existing) => distanceSquared(existing, point) <= epsilon ** 2)) points.push(point);
  };
  const vertices = shapeVertices(kind, size, rotation);
  for (const [first, second] of polytopes[kind].edges) {
    const start = vertices[first];
    const end = vertices[second];
    const d0 = start[3] - sliceW;
    const d1 = end[3] - sliceW;
    if (Math.abs(d0) <= epsilon) add([start[0], start[1], start[2]]);
    if (Math.abs(d1) <= epsilon) add([end[0], end[1], end[2]]);
    if (Math.abs(d0) <= epsilon || Math.abs(d1) <= epsilon || (d0 < 0) === (d1 < 0)) continue;
    const t = d0 / (d0 - d1);
    add([
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t,
    ]);
  }
  return { points };
}

