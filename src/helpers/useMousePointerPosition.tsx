import { useEffect, useState } from 'react';

interface MousePointerPositionProperties {
  clientX: number;
  clientY: number;
}
function useMousePointerPosition() {
  const [position, setPosition] = useState<MousePointerPositionProperties>({
    clientX: 0,
    clientY: 0,
  });
  useEffect(() => {
    const setFromEvent = (e: MousePointerPositionProperties) =>
      setPosition({ clientX: e.clientX, clientY: e.clientY });
    window.addEventListener('mousemove', setFromEvent);
    return () => {
      window.removeEventListener('mousemove', setFromEvent);
    };
  }, []);

  return position;
}
export default useMousePointerPosition;
