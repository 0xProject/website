import { useEffect, useRef } from 'react';

import { APIClient } from 'ts/utils/api_client';

export const useAPIClient = (networkId: number): APIClient => {
    const apiClientRef = useRef<APIClient>(new APIClient(networkId));

    useEffect(() => {
        if (apiClientRef.current.networkId === networkId) {
            return;
        }

        apiClientRef.current = new APIClient(networkId);
    }, [networkId]);

    return apiClientRef.current;
};
