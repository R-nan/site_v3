import * as THREE from 'three';
import IAbstractEffect from '../../effects/IAbstractEffect';

export default class Canvas3DManager {
  private parent: HTMLElement
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public clock: THREE.Clock
  public size: {[key: string]: number}
  public effects: IAbstractEffect | null


  constructor(parentElement: HTMLElement) {
    this.parent = parentElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer()
    this.clock = new THREE.Clock()
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.effects = null
    this.setup()
  }

  public setup() {
    this.renderer.setSize(this.size.width, this.size.height)
    this.parent.appendChild(this.renderer.domElement)

    this.clock.start()
    this.animate()
  }

  public update() {}

  public animate() {
    this.update()
    requestAnimationFrame(this.animate.bind(this))
    this.renderer.render(this.scene, this.camera)
    if(this.effects) {
      this.effects.update()
    }
  }
}