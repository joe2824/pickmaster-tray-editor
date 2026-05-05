import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Matrix4, type BufferGeometry } from 'three';

const loader = new STLLoader();

export function parseStlBuffer(buffer: ArrayBuffer): BufferGeometry {
  const geo = loader.parse(buffer);
  geo.computeVertexNormals();
  // STL files are typically Y-up; our scene is Z-up
  geo.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));
  geo.center();
  geo.computeBoundingBox();
  return geo;
}

export async function loadStlFile(file: File): Promise<{ geo: BufferGeometry; buffer: ArrayBuffer }> {
  const buffer = await file.arrayBuffer();
  return { geo: parseStlBuffer(buffer), buffer };
}
