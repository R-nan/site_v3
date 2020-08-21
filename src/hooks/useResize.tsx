import { useCallback, useRef, useEffect } from "react";

export const useResize = (resizeHandler: () => void) => {
  const requestAnimationRef = useRef(0);
  
  const handleEvent = useCallback(() => {
    cancelAnimationFrame(requestAnimationRef.current);
    requestAnimationRef.current = requestAnimationFrame(resizeHandler)
  }, [resizeHandler])

  useEffect(() => {
    window.addEventListener('resize', handleEvent);

    return () => {
      cancelAnimationFrame(requestAnimationRef.current);
      window.removeEventListener('resize', handleEvent)
    }
  }, [handleEvent])
}