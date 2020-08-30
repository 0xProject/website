import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useEagerConnect, useInactiveListener } from 'ts/hooks/use_web3';

interface IProps {
    children: JSX.Element;
}

export function Web3ReactManager({ children }: IProps): any {
    const [activatingConnector, setActivatingConnector] = React.useState();
    const { connector } = useWeb3React();

    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const isTriedEager = useEagerConnect();

    useInactiveListener(!isTriedEager || !!activatingConnector);

    return children;
}
