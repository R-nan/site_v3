import Canvas3DManager from '../CanvasManager/Canvas3DManager';
import Dots from './Dots';
import TriColorEffect from '../../effects/TriColorEffect';

export class BreathingDotsManager extends Canvas3DManager {
  public dots: Dots
  public effects: TriColorEffect | null

  constructor(parentElement: HTMLElement) {
    super(parentElement)
    this.renderer.sortObjects = false;
    this.dots = new Dots()
    this.scene.add(this.dots.mesh)
    this.camera.position.z = 5;
    this.effects = new TriColorEffect(this.scene, this.renderer, this.size, this.camera)
    this.init()
  }

  public update() {
    if (this.dots) {
      this.dots.update(this.clock)
    }
  }

  public init() {
    const {positions, transform} = this.dots.initialState
  
    positions.forEach((position:any, i:number) => {
      transform.setPosition(position.x, position.y, 0)
      this.dots.mesh.setMatrixAt(i, transform)
    });
  }
}