import { useRef, useEffect } from 'react';

function useFrameLoop(callback: () => void) {
  const requestID = useRef<number>();
  const loop = () => {
    callback();
    requestID.current = requestAnimationFrame(loop);
  };
  useEffect(() => {
    requestID.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestID.current || 0);
  });
}
export default useFrameLoop;
