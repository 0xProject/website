import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 750;

// This hook serves to avoids flashing components unnecessarily during render.
// ex1. A loading spinner that only lasts 200ms shouldn't be shown to the user because flash of content looks bad
// ex2. A loading spinner that lasts longer than 750ms, we should notify the user something is loading at that point
const useDelay = (wantToShow: boolean, delay?: number) => {
  // tslint:disable-next-line: boolean-naming
  const [doneWaiting, setDoneWaiting] = useState<boolean>(false);
  useEffect(() => {
    if (!wantToShow) {
      return setDoneWaiting(false);
    }
    const timeout = setTimeout(() => setDoneWaiting(true), delay || DEFAULT_DELAY);
    return () => clearTimeout(timeout);
  }, [wantToShow]);
  return doneWaiting;
};

export { useDelay };