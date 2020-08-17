import React, { createRef, RefObject, useEffect, useState, useRef, useCallback } from 'react';
import { StyledHome } from './styled';
import CanvasElement from '../../components/CanvasElement';
import CanvasManager from '../../canvasComponents/CanvasManager/CanvasManager';
import FontRenderer from '../../canvasComponents/FontRenderer/FontRenderer';
import * as Italiana from '../../assets/fonts/italiana.js';
import BoidsManager from '../../canvasComponents/BoidsManager/BoidsManager';
import ShapeType from '../../canvasComponents/BoidsManager/ShapeType';
import BoidStates from '../../canvasComponents/BoidsManager/BoidStates';

export const Home = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  const [canvas, setCanvas] = useState<CanvasManager | null>(null);
  const fontRendererRef = useRef<any | null>(null);
  const boidsRef = useRef<any | null>(null);
  useEffect(() => {
    const CanvasComponent = new CanvasManager(canvasRef.current as HTMLCanvasElement)
    setCanvas(CanvasComponent);

    return () => {
      CanvasComponent.dispose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(canvas) {
      const fontRenderer = new FontRenderer(canvas, {
        text: 'Anthony Lui',
        font: Italiana,
        align: 'center'
      })
      canvas.init();
      fontRenderer.init();
      
      fontRenderer.getFontVectors().then((fontVectors) => {
        const boids = new BoidsManager(canvas, {
          count: 100,
          initialPositions: fontVectors(),
          boidShape: ShapeType.KITE,
          boidState: BoidStates.REST,
        })
        boids.init();
        fontRendererRef.current = fontRenderer;
        boidsRef.current = boids;
      });
    }
  }, [canvas])

  const handleClick = useCallback(() => {
    // fontRendererRef.current.changeColor({r: 40, g: 100, b:2})
    // console.log(fontRendererRef.current)
    boidsRef.current.release();
  }, [])

  return (
    <StyledHome onClick={handleClick}>
      <CanvasElement ref={canvasRef} id={'boids'}/>
    </StyledHome>
  )
};