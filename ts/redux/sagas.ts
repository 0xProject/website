import { call, put, takeLatest } from 'redux-saga/effects';
import { Action, ActionTypes, ConnectedWalletDetails } from 'ts/types';
import { Web3Connector } from 'ts/utils/web3_connector';

const web3Connector = new Web3Connector();

function* connectWallet(_: Action): Iterator<undefined> {
    try {
        const walletDetails: ConnectedWalletDetails = yield call(
            web3Connector.connectToWalletAsync.bind(web3Connector),
        );

        yield put({ type: ActionTypes.ConnectWalletSucceeded, data: walletDetails });
        yield put({ type: ActionTypes.UpdateIsConnectWalletDialogOpen, data: false });
    } catch (error) {
        yield put({ type: ActionTypes.ConnectWalletFailed, data: error });
    }
}

export function* sagas(): Iterator<undefined> {
    yield takeLatest(ActionTypes.ConnectWallet, connectWallet);
}
