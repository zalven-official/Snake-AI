import { RefObject, useEffect } from 'react';

function useOnClickOutside(
  ref: RefObject<HTMLInputElement> | undefined,
  handler: (event: Event) => void
) {
  useEffect(() => {
    function listener(event: Event) {
      // Do nothing if clicking ref's element or descendent elements
      if (event.target instanceof Element && ref instanceof Element)
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
      handler(event);
    }
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
