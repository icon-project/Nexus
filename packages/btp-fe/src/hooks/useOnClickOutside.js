import { useEffect } from 'react';

// https://usehooks.com/useOnClickOutside/
export function useOnClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (active) {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          ref &&
          ((!ref.current && ref.contains(event.target)) ||
            (ref.current && ref.current.contains(event.target)))
        ) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }
  }, [ref, handler, active]);
}
