import { useCallback, useEffect, RefObject } from "react";

export const useMouseMove = (ref: RefObject<HTMLElement | HTMLCanvasElement>, mouseMoveHandler: (e: MouseEvent) => void) => {
  const handleEvent = useCallback((event) => {
    mouseMoveHandler(event);
    
  }, [mouseMoveHandler]);

  useEffect(() => {
    const element = ref.current;
    if (element) element.addEventListener('mousemove', handleEvent);

    return () => {
      if (element)element.removeEventListener('mousemove', handleEvent);
    }
  }, [handleEvent, ref])
}