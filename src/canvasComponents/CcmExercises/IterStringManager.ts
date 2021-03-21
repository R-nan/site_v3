import { createRandom } from '../../utils/random';
import { lerp } from '../../utils/utils';
import Vector from '../../utils/Vector';
import CanvasManager from '../CanvasManager/CanvasManager';
import IterationManager from './IterationManager';

interface IPosition {
  x: number;
  y: number;
}

export default class IterStringManager extends CanvasManager {
  // public options: any;
  public otherOptions: any;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    // this.otherOptions = this.options
    this.otherOptions = {
      items: [],
      count: 10,
      margin: 30
    }
    console.log('asdf', this)
  }

  private drawGrid() {
    const time = this.frame / 100
    this.otherOptions.items.forEach((item: any) => {
      const {position}: {position: IPosition} = item
      // console.log(position)
      let {x: u, y: v} = position
      const x = lerp(this.otherOptions.margin, this.canvas.width - this.otherOptions.margin, u)
      const y = lerp(this.otherOptions.margin, this.canvas.height - this.otherOptions.margin, v)
      // this.context.fillStyle = `rgb(${createRandom.noise2D(x, y, time, 100)}, ${createRandom.noise2D(x, y, time, 100)}, 100)`
      this.context.fillStyle = 'white'
      // this.context.fillRect(x, y, 10, 100)
      // this.context.translate(x, y)
      this.context.save()
      this.context.strokeStyle = `rgb(${createRandom.noise2D(x, y, time / 10000, 1.5) * 200 + 100}, ${createRandom.noise2D(y, x, time / 10000, 1.5)* 200 + 100}, 100)`
      this.context.lineWidth = 3
      // this.context.rotate(createRandom.noise2D(x, y, time / 10000, 1.5))
      // this.context.stroke(this.createShape(createRandom.noise2D(x, y, time / 10000, 1.5) * 50))
      this.context.beginPath()
      this.context.arc(x, y, 5, 0, Math.PI * 2)
      this.context.closePath()
      this.drawLines(u, v, x, y, time)
      this.context.fill()
      this.context.restore()
    });
  }

  private drawLines(u: number, v: number, x: number, y: number, time: number) {
    // this.context.moveTo(0, 0)
    const itemPositions = this.otherOptions.items.map((item: any) => item.position)
    // console.log(itemPositions.length)
    if (Math.floor(u * 10) === 0 || Math.floor(v * 10) === this.otherOptions.count) {
      // console.log('what?')
      this.context.strokeStyle = 'red'
      this.context.lineTo(this.options.mousePosition.x, this.options.mousePosition.y)
      this.context.stroke()
      this.context.fillStyle = 'rgba(255, 0, 0, 1)'
      this.context.beginPath()
      this.context.arc(x, y, 10, 0, Math.PI * 2)
      // console.log('does this still run?')
      this.context.fill()
    }
    itemPositions.forEach((position: any, index: number) => {
      // console.log(Math.floor(position.x * 10) === 0)
      let {x: u, y: v} = position
      const otherx = lerp(this.otherOptions.margin, this.canvas.width - this.otherOptions.margin, u)
      const othery = lerp(this.otherOptions.margin, this.canvas.height - this.otherOptions.margin, v)
      
    });
  }

  public setup () {
    const {options} = this

    let items: Array<any> = []

    for(let i = 0; i < this.otherOptions.count; i++) {
      for(let j = 0; j < this.otherOptions.count; j++) {
        const position = new Vector(i/(this.otherOptions.count - 1), j/(this.otherOptions.count - 1))
        items.push({
          position,
        })
      }
    }

    this.otherOptions.items = items
    // this.draw()
  }

  public draw () {
    this.drawGrid()
  }
}