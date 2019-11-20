import { useSelector } from 'react-redux';

import { State } from 'ts/redux/reducer';
import { APIClient } from 'ts/utils/api_client';

export const useAPIClient = (): APIClient => {
    const networkId = useSelector((state: State) => state.networkId);
    return new APIClient(networkId);
};
