import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import * as THREE from 'three';
import IAbstractEffect from './IAbstractEffect'

// Shader that composites the r,g,b channels of 3 textures, respectively
const triColorMix = {
  uniforms: {
    tDiffuse1: { value: null },
    tDiffuse2: { value: null },
    tDiffuse3: { value: null }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse1;
    uniform sampler2D tDiffuse2;
    uniform sampler2D tDiffuse3;
    
    void main() {
      vec4 del0 = texture2D(tDiffuse1, vUv);
      vec4 del1 = texture2D(tDiffuse2, vUv);
      vec4 del2 = texture2D(tDiffuse3, vUv);
      float alpha = min(min(del0.a, del1.a), del2.a);
      gl_FragColor = vec4(del0.r, del1.g, del2.b, alpha);
    }
  `
}

export default class TriColorEffect extends IAbstractEffect {
  initialState: any;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  size: any;
  camera: THREE.Camera;
  effectsComposer: EffectComposer;
  renderPass: RenderPass;
  blendPass: ShaderPass;
  savePass: SavePass;
  shaderPass: ShaderPass;
  swap: boolean;
  delay1: any;
  delay2: any;

  constructor(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    size: any,
    camera: THREE.Camera
  ) {
    super(scene, renderer, size, camera)

    this.initialState = {
      rtA: new THREE.WebGLRenderTarget(size.width, size.height),
      rtB: new THREE.WebGLRenderTarget(size.width, size.height)
    }
    this.scene = scene;
    this.renderer = renderer;
    this.size = size;
    this.camera = camera;
    this.swap = false;
    this.effectsComposer = new EffectComposer(this.renderer)
    this.effectsComposer.setSize(this.size.width, this.size.height)
    this.renderPass = new RenderPass(this.scene, this.camera)
    let delay1 = this.swap ? this.initialState.rtB : this.initialState.rtA;
    let delay2 = this.swap ? this.initialState.rtA : this.initialState.rtB;
    this.blendPass = new ShaderPass(triColorMix, 'tDiffuse1')
    this.blendPass.needsSwap = false
    this.blendPass.uniforms['tDiffuse2'].value = delay1.texture
    this.blendPass.uniforms['tDiffuse3'].value = delay2.texture

    this.savePass = new SavePass(this.initialState.rtB)
    this.savePass.needsSwap = true
    this.shaderPass = new ShaderPass(CopyShader)
    this.effectsComposer.addPass(this.renderPass)
    this.effectsComposer.addPass(this.blendPass)
    this.effectsComposer.addPass(this.savePass)
    this.effectsComposer.addPass(this.shaderPass)
  }

  public update() {
    let delay1 = this.swap ? this.initialState.rtB : this.initialState.rtA;
    let delay2 = this.swap ? this.initialState.rtA : this.initialState.rtB;

    this.savePass.renderTarget = delay2;
    this.blendPass.uniforms['tDiffuse2'].value = delay1.texture
    this.blendPass.uniforms['tDiffuse3'].value = delay2.texture
    this.swap = !this.swap
    this.effectsComposer.render()
  }
}