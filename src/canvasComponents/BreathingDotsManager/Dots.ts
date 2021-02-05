import * as THREE from 'three';

export default class Dots {
  public geometry: THREE.CircleBufferGeometry
  public material: THREE.MeshBasicMaterial
  public mesh: THREE.InstancedMesh
  public dotCount: number
  public initialState: any

  constructor() {
    const right = new THREE.Vector3(1, 0, 0);
    this.dotCount = 10000;
    this.geometry = new THREE.CircleBufferGeometry(0.15)
    this.material = new THREE.MeshBasicMaterial({color: 0xffffff})
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.dotCount);
    this.initialState = {
      vec: new THREE.Vector3(),
      transform: new THREE.Matrix4(),
      positions: this.setPositions(),
      // distances: this.setPositions().map((position) => position.length())

      distances: this.setPositions().map((position) => position.length() + Math.cos(position.angleTo(right) * 8) * .5)
    }
  }

  public roundedSquareWave (t: number, delta: number, a: number, f: number) {
    // https://www.desmos.com/calculator/agt7tb1dky
    return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
  }

  public update (clock: THREE.Clock) {
    const { vec, positions, transform, distances } = this.initialState
    
    for (let i = 0; i < 10000; ++i) {
      const dist = distances[i]
      const t = clock.getElapsedTime() - dist / 25
      const wave = this.roundedSquareWave(t, 0.15 + (0.2 * dist) / 72, .4, 1 / 3.8)
      const scale = 1 + wave * .3
      vec.copy(positions[i]).multiplyScalar(wave  + 1.3)
      transform.setPosition(vec)
      this.mesh.setMatrixAt(i, transform)
    }
      
      this.mesh.instanceMatrix.needsUpdate = true
  }

  public setPositions() {
    return [...Array(10000)].map((_, i) => {
      const position = new THREE.Vector3()
      position.x = (i % 100) - 50;
      position.y = Math.floor(i / 100 ) - 50

      position.y += (i % 2) * 0.5

      // position.x += Math.random() * 0.3
      // position.y += Math.random() * 0.3
      return position
    })
  }

  // public init() {
  //   const transform = new THREE.Matrix4()

  //   for (let i = 0; i < this.dotCount; ++i) {
  //     let x = (i % 100) - 50;
  //     let y = Math.floor(i / 100 ) - 50

  //     y += (i % 2) * 0.5

  //     x += Math.random() * 0.3
  //     y += Math.random() * 0.3
  //     transform.setPosition(x, y, 0)
  //     this.mesh.setMatrixAt(i, transform)
  //   }
  // }
}