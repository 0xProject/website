import { useCallback, useEffect, useState } from 'react';

// https://usehooks.com/useAsync/
export const useAsync = <T, E = string>(asyncFunction: () => Promise<T>, immediate = true) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [value, setValue] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);
    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback(async () => {
        setStatus('pending');
        setValue(null);
        setError(null);
        return asyncFunction()
            .then((response: any) => {
                setValue(response);
                setStatus('success');
            })
            .catch((e: any) => {
                setError(e);
                setStatus('error');
            });
    }, [asyncFunction]);
    // Call execute if we want to fire it right away.
    // Otherwise execute can be called later, such as
    // in an onClick handler.
    useEffect(() => {
        if (immediate) {
            // tslint:disable-next-line:no-floating-promises
            execute();
        }
    }, [execute, immediate]);
    return { execute, status, value, error };
};
