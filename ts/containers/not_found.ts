import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { NotFound as NotFoundComponent, NotFoundProps } from 'ts/pages/not_found';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { Action } from 'ts/types';
import { Translate } from 'ts/utils/translate';

interface ConnectedState {
    translate: Translate;
}

interface ConnectedDispatch {
    dispatcher: Dispatcher;
}

const mapStateToProps = (state: State, _ownProps: NotFoundProps): ConnectedState => ({
    translate: state.translate,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): ConnectedDispatch => ({
    dispatcher: new Dispatcher(dispatch),
});

export const NotFound = connect(
    mapStateToProps,
    mapDispatchToProps,
)(NotFoundComponent);
