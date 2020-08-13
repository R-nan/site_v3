import React, { createRef, RefObject, useEffect, useState, useRef, useCallback } from 'react';
import { StyledHome } from './styled';
import CanvasElement from '../../components/CanvasElement';
import CanvasManager from '../../canvasComponents/CanvasManager/CanvasManager';
import FontRenderer from '../../canvasComponents/FontRenderer/FontRenderer';
import * as Italiana from '../../assets/fonts/italiana.js';
import BoidsManager from '../../canvasComponents/BoidsManager/BoidsManager';

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
      const boids = new BoidsManager(canvas, {
        count: 20,
        size: 4.0,
        cohesionValue: 1,
        alignmentValue: 0.3,
        separationValue: 1,
        maxForce: 0.2,
        maxSpeed: 7
      })
      fontRendererRef.current = fontRenderer;
      boidsRef.current = boids;
      canvas.init();
      fontRenderer.init();
      boids.init();
    }
  }, [canvas])

  const handleClick = useCallback(() => {
    fontRendererRef.current.changeColor({r: 40, g: 100, b:2})
  }, [])

  return (
    <StyledHome onClick={handleClick}>
      <CanvasElement ref={canvasRef} id={'boids'}/>
    </StyledHome>
  )
};