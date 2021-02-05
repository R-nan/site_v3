
import React, { createRef, RefObject, useLayoutEffect } from 'react';
import { BreathingDotsManager } from '../../canvasComponents/BreathingDotsManager/BreathingDotsManager';
import { useResize } from '../../hooks/useResize';

export const BreathingDots = () => {
  const parentRef: RefObject<HTMLDivElement> = createRef();
  
  useLayoutEffect(() => {
    new BreathingDotsManager(parentRef.current as HTMLDivElement)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useResize(() => {

  });

  return (
    <div ref={parentRef}></div>
  )
}