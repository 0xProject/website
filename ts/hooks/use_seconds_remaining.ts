import { formatDistanceStrict, max } from 'date-fns';
import { useEffect, useState } from 'react';

const getTimeLeftDisplayValue = (dateInFuture: Date): string => {
  const timeLeftDisplayValue = formatDistanceStrict(dateInFuture, new Date(), { unit: 'second' });
  return timeLeftDisplayValue;
};

// Counts down to a provided target date
const useTimeRemaining  = (targetTime: Date | undefined): string | undefined => {
  const intervalTime = 1000;
  const [_counter, setCounter] = useState<number>(0);

  // Reset counter when targetTime changes
  useEffect(() => {
    setCounter(0);
  }, [targetTime]);

  // Run interval to update state and trigger a rerender
  useEffect(() => {
      if (!targetTime) {
          return undefined;
      }
      const interval = setInterval(() => {
          // If the targetTime has past, stop updating
          if (targetTime < new Date()) {
            return;
          }
          setCounter((prev: number ) => prev + 1);
      }, intervalTime);
      return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime) {
      return undefined;
  }
  return getTimeLeftDisplayValue(max([targetTime, new Date()]));
};

export {
  useTimeRemaining,
  getTimeLeftDisplayValue,
};
