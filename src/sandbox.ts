import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { sliceShape, type Rotation4 } from './geometry4d';
import { FIXED_STEP, isRecoverable, stepToy, type ToyState } from './physics';
import { scenes, type SceneDefinition } from './scenes';

export class Sandbox {
  private renderer: THREE.WebGLRenderer; private scene = new THREE.Scene(); private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private controls: OrbitControls; private meshes = new Map<string, THREE.Mesh>(); private raycaster = new THREE.Raycaster(); private pointer = new THREE.Vector2();
  private dragPlane = new THREE.Plane(); private dragPoint = new THREE.Vector3(); private grabbed?: ToyState; private lastDrag = new THREE.Vector3();
  private lastTime = performance.now(); private accumulator = 0;
  toys: ToyState[] = []; sliceW = 0; sliceRotation: Rotation4 = [0, 0, 0]; paused = false; timeScale = 1; selectedId?: string; onChange?: () => void; currentScene: SceneDefinition = scenes[1];

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); this.renderer.shadowMap.enabled = true; host.append(this.renderer.domElement);
    this.camera.position.set(7.5, 5.2, 8.5); this.controls = new OrbitControls(this.camera, this.renderer.domElement); this.controls.target.set(0, 0.1, 0); this.controls.enableDamping = true;
    this.scene.background = new THREE.Color(0xded9cc); this.scene.fog = new THREE.Fog(0xded9cc, 13, 26); this.scene.add(new THREE.HemisphereLight(0xfff8e7, 0x56675e, 2.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.8); sun.position.set(5, 9, 4); sun.castShadow = true; this.scene.add(sun);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0xb8b6a9, roughness: 0.92 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.38; floor.receiveShadow = true; this.scene.add(floor);
    const grid = new THREE.GridHelper(20, 20, 0x72867b, 0x9ea69e); grid.position.y = -2.36; this.scene.add(grid);
    this.reset(); addEventListener('resize', this.resize); this.renderer.domElement.addEventListener('pointerdown', this.pointerDown); addEventListener('pointermove', this.pointerMove); addEventListener('pointerup', this.pointerUp); this.resize(); this.frame(performance.now());
  }
  loadScene(id: string): void { this.currentScene = scenes.find((scene) => scene.id === id) ?? scenes[1]; this.reset(); }
  reset(): void { this.toys = structuredClone(this.currentScene.toys); this.sliceW = 0; this.sliceRotation = [0, 0, 0]; this.selectedId = undefined; this.rebuild(); this.onChange?.(); }
  addToy(kind: ToyState['kind']): void { const colors = [0xe78357, 0x7560a9, 0x4f8da5, 0xe6a548, 0x55a37e, 0xd76f63]; const index = this.toys.length; this.toys.push({ id: `${kind}-${Date.now()}`, kind, size: kind === 'tesseract' ? 1.8 : 1.35, color: colors[index % colors.length], position: [(index % 4) - 1.5, 2.3, 0, 0], velocity: [0, 0, 0, 0], rotation: [0, 0, 0] }); this.rebuild(); this.onChange?.(); }
  recoverAll(): void { this.toys = this.toys.map((toy, index) => ({ ...toy, position: [index * 2 - 1, 0, 0, 0], velocity: [0, 0, 0, 0] })); this.rebuild(); this.onChange?.(); }
  setSlice(value: number): void { this.sliceW = value; this.rebuild(); this.onChange?.(); }
  setRotation(axis: number, value: number): void { this.sliceRotation[axis] = value; this.rebuild(); this.onChange?.(); }
  private rebuild(): void {
    for (const mesh of this.meshes.values()) { this.scene.remove(mesh); mesh.geometry.dispose(); } this.meshes.clear();
    for (const toy of this.toys) {
      const localW = this.sliceW - toy.position[3]; const rotation = toy.rotation.map((angle, axis) => angle + this.sliceRotation[axis]) as Rotation4; const slice = sliceShape(toy.kind, toy.size, rotation, localW);
      let geometry: THREE.BufferGeometry | undefined;
      if (toy.kind === 'duocylinder' && slice.radius !== undefined && slice.depth !== undefined && slice.depth > 0.01) geometry = new THREE.CylinderGeometry(slice.radius, slice.radius, slice.depth, 36);
      else if (toy.kind === 'hypertorus' && slice.radius !== undefined && slice.depth !== undefined && slice.depth > 0.01) geometry = new THREE.TorusGeometry(slice.radius, slice.depth, 16, 48);
      else if (slice.radius !== undefined && slice.radius > 0.01) geometry = new THREE.SphereGeometry(slice.radius, 32, 20);
      else if (slice.points.length >= 4) geometry = new ConvexGeometry(slice.points.map((point) => new THREE.Vector3(...point))); if (!geometry) continue;
      geometry.computeVertexNormals(); const selected = toy.id === this.selectedId; const material = new THREE.MeshPhysicalMaterial({ color: toy.color, roughness: 0.38, clearcoat: 0.25, emissive: selected ? 0x27231a : 0x000000 });
      const mesh = new THREE.Mesh(geometry, material); mesh.position.set(toy.position[0], toy.position[1], toy.position[2]); mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData.id = toy.id; this.meshes.set(toy.id, mesh); this.scene.add(mesh);
    }
  }
  private pointerDown = (event: PointerEvent): void => { const hit = this.pick(event); if (!hit) return; this.grabbed = this.toys.find((toy) => toy.id === hit.object.userData.id); this.selectedId = this.grabbed?.id; this.dragPlane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(new THREE.Vector3()), hit.point); this.lastDrag.copy(hit.point); this.controls.enabled = false; this.renderer.domElement.setPointerCapture(event.pointerId); this.rebuild(); this.onChange?.(); };
  private pointerMove = (event: PointerEvent): void => { if (!this.grabbed) return; this.setPointer(event); this.raycaster.setFromCamera(this.pointer, this.camera); if (!this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint)) return; const delta = this.dragPoint.clone().sub(this.lastDrag); this.grabbed.position[0] += delta.x; this.grabbed.position[1] += delta.y; this.grabbed.position[2] += delta.z; this.grabbed.velocity = [delta.x * 18, delta.y * 18, delta.z * 18, 0]; this.lastDrag.copy(this.dragPoint); this.rebuild(); this.onChange?.(); };
  private pointerUp = (): void => { this.grabbed = undefined; this.controls.enabled = true; };
  private setPointer(event: PointerEvent): void { const bounds = this.renderer.domElement.getBoundingClientRect(); this.pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1); }
  private pick(event: PointerEvent): THREE.Intersection | undefined { this.setPointer(event); this.raycaster.setFromCamera(this.pointer, this.camera); return this.raycaster.intersectObjects([...this.meshes.values()])[0]; }
  private resize = (): void => { const width = this.host.clientWidth; const height = this.host.clientHeight; this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height, false); };
  private frame = (now: number): void => { const elapsed = Math.min((now - this.lastTime) / 1000, 0.1); this.lastTime = now; if (!this.paused && !this.grabbed) { this.accumulator += elapsed * this.timeScale; let changed = false; while (this.accumulator >= FIXED_STEP) { this.toys = this.toys.map((toy) => stepToy(toy, FIXED_STEP, this.currentScene.gravity)); this.accumulator -= FIXED_STEP; changed = true; } if (changed) this.rebuild(); } this.controls.update(); this.renderer.render(this.scene, this.camera); requestAnimationFrame(this.frame); };
  get selected(): ToyState | undefined { return this.toys.find((toy) => toy.id === this.selectedId); }
  get recoverableCount(): number { return this.toys.filter(isRecoverable).length; }
}
