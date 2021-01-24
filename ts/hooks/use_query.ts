import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

function useQuery<T = any>(): T {
    const { search } = useLocation();
    const params = queryString.parse(search);
    return params;
}

export { useQuery };
