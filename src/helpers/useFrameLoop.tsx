import { useRef, useEffect } from 'react';

function useFrameLoop(callback: (time: number, deltaTime: number) => void) {
  const requestID = useRef<number>();
  const previousTime = useRef<number>();
  const loop = (time: number) => {
    previousTime.current = time || 0;
    if (previousTime.current !== undefined) {
      const deltaTime = time - previousTime.current;
      callback(time, deltaTime);
    }
    requestID.current = requestAnimationFrame(loop);
  };
  useEffect(() => {
    requestID.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestID.current || 0);
  });
}
export default useFrameLoop;
