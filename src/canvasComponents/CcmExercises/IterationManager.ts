import Vector from '../../utils/Vector';
import CanvasManager from '../CanvasManager/CanvasManager';
import {lerp} from '../../utils/utils'
import {createRandom} from '../../utils/random';

interface IPosition {
  x: number;
  y: number;
}

export default class IterationManager extends CanvasManager {
  public iterationOptions: any;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.iterationOptions = {
      items: [],
      count: 10,
      margin: 30
    }
  }

  private createShape(size: number) {
    const sides = 5 // for pentagon
    // const step  = 2 * Math.PI / sides
    const height = 5
    const width = 30
    const shape = new Path2D()
      shape.moveTo(0, 0)
      shape.moveTo(-width / 2, -height / 2)
      shape.lineTo(width / 2, -height / 2)
      shape.lineTo(width / 2, height / 2)
      shape.lineTo(-width / 2, height / 2)
      for (let i = 0; i < sides + 1; i++) {
        if (i === 0) {
          shape.moveTo(size * Math.cos(i * 2 * Math.PI / sides), size * Math.sin(i * 2 * Math.PI / sides))
        } else {
          shape.lineTo(size * Math.cos(i * 2 * Math.PI / sides), size * Math.sin(i * 2 * Math.PI / sides))
        }
      }
      shape.closePath()
      return shape
  }

  private drawGrid() {
    const time = this.frame / 100
    this.iterationOptions.items.forEach((item: any) => {
      const {position}: {position: IPosition} = item
      let {x: u, y: v} = position
      const x = lerp(this.iterationOptions.margin, this.canvas.width - this.iterationOptions.margin, u)
      const y = lerp(this.iterationOptions.margin, this.canvas.height - this.iterationOptions.margin, v)
      // this.context.fillStyle = `rgb(${createRandom.noise2D(x, y, time, 100)}, ${createRandom.noise2D(x, y, time, 100)}, 100)`
      this.context.save()
      this.context.strokeStyle = `rgb(${createRandom.noise2D(x, y, time / 10000, 1.5) * 200 + 100}, ${createRandom.noise2D(y, x, time / 10000, 1.5)* 200 + 100}, 100)`
      this.context.lineWidth = 3
      this.context.translate(x, y)
      this.context.rotate(createRandom.noise2D(x, y, time / 10000, 1.5))
      this.context.stroke(this.createShape(createRandom.noise2D(x, y, time / 10000, 1.5) * 50))
      this.context.restore()
    });
  }

  public setup () {
    const {iterationOptions} = this

    let items: Array<any> = []

    for(let i = 0; i < iterationOptions.count; i++) {
      for(let j = 0; j < iterationOptions.count; j++) {
        const position = new Vector(i/(iterationOptions.count - 1), j/(iterationOptions.count - 1))
        items.push({
          position
        })
      }
    }

    iterationOptions.items = items

  }

  public draw () {
    this.drawGrid()
  }
}