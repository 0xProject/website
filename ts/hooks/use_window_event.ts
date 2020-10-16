import { useEffect } from 'react';

export const useWindowEvent = (event: string, ref: any, callback: any) => {
    useEffect(() => {
        document.addEventListener(event, callback);
        return () => document.removeEventListener(event, callback);
    }, [ref]);
};
