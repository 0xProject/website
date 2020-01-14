import { formatDistanceStrict, max } from 'date-fns';
import { useEffect, useState } from 'react';

const getTimeLeftInSeconds = (dateInFuture: Date): number => {
    const timeLeftInSecondsAsString = formatDistanceStrict(dateInFuture, new Date(), { unit: 'second' });
    const leftLeftInSeconds: number = parseInt(timeLeftInSecondsAsString, 10);
    return leftLeftInSeconds;
};

// Counts down to a provided target date
const useSecondsRemaining = (targetTime: Date | undefined): number | undefined => {
    const intervalTime = 1000;
    const [, setCounter] = useState<number>(0);

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
            setCounter((prev: number) => prev + 1);
        }, intervalTime);
        return () => clearInterval(interval);
    }, [targetTime]);

    if (!targetTime) {
        return undefined;
    }
    return getTimeLeftInSeconds(max([targetTime, new Date()]));
};

export { useSecondsRemaining };
