export default class IAbstractEffect {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  size: any;
  camera: THREE.Camera;

  constructor(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    size: any,
    camera: THREE.Camera
  ) {
    this.scene = scene;
    this.renderer = renderer;
    this.size = size;
    this.camera = camera;
  }

  public update() {}
}