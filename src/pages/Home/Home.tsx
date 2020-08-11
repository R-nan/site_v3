import React, { createRef, RefObject, useEffect } from 'react';
import { StyledHome } from './styled';
import CanvasElement from '../../components/CanvasElement';
import CanvasManager from '../../canvasComponents/CanvasManager/CanvasManager';

export const Home = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  useEffect(() => {
    const CanvasComponent = new CanvasManager(canvasRef.current as HTMLCanvasElement)
    CanvasComponent.init();
    return () => {
      CanvasComponent.dispose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledHome>
      <CanvasElement ref={canvasRef} id={'boids'}/>
    </StyledHome>
  )
};