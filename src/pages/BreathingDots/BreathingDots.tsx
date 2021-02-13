
import React, { createRef, RefObject, useLayoutEffect, useState } from 'react';
import { BreathingDotsManager } from '../../canvasComponents/BreathingDotsManager/BreathingDotsManager';
import { useResize } from '../../hooks/useResize';

export const BreathingDots = () => {
  const parentRef: RefObject<HTMLDivElement> = createRef();
  const [component, setComponent] = useState<BreathingDotsManager | null>(null);

  useLayoutEffect(() => {
    setComponent(new BreathingDotsManager(parentRef.current as HTMLDivElement))
    return () => {
      component?.dotsDispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useResize(() => {
    if(component) {
      component.resize()
    }
  });

  return (
    <div ref={parentRef}></div>
  )
}