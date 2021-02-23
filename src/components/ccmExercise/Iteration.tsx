import React, { createRef, RefObject, useLayoutEffect, useState } from 'react';
import IterationManager from '../../canvasComponents/CcmExercises/IterationManager'
import { useResize } from '../../hooks/useResize';
import { colorBlack } from '../../pages/Home/Home';
import CanvasElement from '../CanvasElement';

export const Iteration = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  const [canvas, setCanvas] = useState<IterationManager | null>(null);
  const canvasInit = (canvas: IterationManager) => {
    canvas.init()
    canvas.setup()
    canvas.modifiers.push(() => canvas.draw())
  }
  useLayoutEffect(() => {
    const CanvasComponent = new IterationManager(canvasRef.current as HTMLCanvasElement);
    // CanvasComponent.options.backgroundColor = {...colorBlack};

    setCanvas(CanvasComponent);
    
    canvasInit(CanvasComponent);

    return () => {
      CanvasComponent.dispose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useResize(() => {
    if(canvas) {
      canvas.resize()
    }
  });
  
  return (
    <div>
      <CanvasElement ref={canvasRef} id={'boids'}/>
    </div>
  )
}