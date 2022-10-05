import { useEffect, RefObject } from 'react';

function useOnScroll(
  ref: RefObject<HTMLInputElement> | undefined,
  handler: (event: WheelEvent) => void
) {
  useEffect(() => {
    function listener(event: WheelEvent) {
      // Do nothing if clicking ref's element or descendent elements
      if (event.target instanceof Element && ref instanceof Element)
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
      handler(event);
    }
    document.addEventListener('wheel', listener);
    return () => {
      document.removeEventListener('wheel', listener);
    };
  });
}

export default useOnScroll;
