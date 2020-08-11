import React, { createRef, RefObject, useEffect } from 'react';
import { StyledHome } from './styled';
import CanvasElement from '../../components/CanvasElement';
import CanvasWrapper from '../../canvasComponents/CanvasWrapper/CanvasWrapper';

export const Home = () => {
  const canvasRef: RefObject<HTMLCanvasElement> = createRef();
  useEffect(() => {
    const CanvasComponent = new CanvasWrapper(canvasRef.current as HTMLCanvasElement)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledHome>
      <CanvasElement ref={canvasRef} id={'boids'}/>
    </StyledHome>
  )
};