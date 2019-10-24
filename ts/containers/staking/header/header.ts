import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'ts/redux/reducer';

import { Header as HeaderComponent } from 'ts/components/staking/header/header';
import { Dispatcher } from 'ts/redux/dispatcher';

interface IHeaderProps {
    location?: Location;
    isNavToggled?: boolean;
    toggleMobileNav?: () => void;
}

interface IConnectedDispatch {
    dispatcher: Dispatcher;
}

interface ConnectedState {}

// TODO(kimpers): Get connected wallet from state after connecting with blockchain
const mapStateToProps = (_: State, _ownProps: IHeaderProps): ConnectedState => ({});

const mapDispatchToProps = (dispatch: Dispatch<State>): IConnectedDispatch => ({
    dispatcher: new Dispatcher(dispatch),
});

export const Header: React.ComponentClass<IHeaderProps> = connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderComponent);
