import Fuse, { FuseOptions } from 'fuse.js';
import { useEffect, useState } from 'react';

// NOTE: See https://fusejs.io for full list of available configuration options
interface SearchOptions {
    keys: string[];
}

export const useSearch = <T>(data: T[], options: SearchOptions) => {
    const [fuse, setFuse] = useState<Fuse<T, FuseOptions<T>> | undefined>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<T[]>([]);

    useEffect(() => {
        setFuse(new Fuse(data, options));
    }, [options.keys, data, setFuse, options]);

    useEffect(() => {
        if (!fuse) {
            return;
        }

        const results = fuse.search<T>(searchTerm) as T[];

        setSearchResults(results);
    }, [fuse, searchTerm]);

    return {
        setSearchTerm,
        searchResults,
    };
};
