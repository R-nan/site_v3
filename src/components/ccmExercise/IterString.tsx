import React, { createRef, RefObject, useLayoutEffect, useState } from 'react';
import IterStringManager from '../../canvasComponents/CcmExercises/IterStringManager'
import { useResize } from '../../hooks/useResize';
import { colorBlack } from '../../pages/Home/Home';
import CanvasElement from '../CanvasElement';

export const IterString = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  const [canvas, setCanvas] = useState<IterStringManager | null>(null);
  const canvasInit = (canvas: IterStringManager) => {
    canvas.init()
    canvas.setup()
    canvas.modifiers.push(() => canvas.draw())
  }

  useLayoutEffect(() => {
    const CanvasComponent = new IterStringManager(canvasRef.current as HTMLCanvasElement);
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
      <CanvasElement ref={canvasRef} id={'Iteration String'}/>
    </div>
  )
}