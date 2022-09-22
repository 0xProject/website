import React from 'react';
import { Route } from 'react-router-dom';

interface RedirectExternalProps {
    to: string;
    from: string;
}

export const RedirectExternal: React.FC<RedirectExternalProps> = (props: RedirectExternalProps) => {
    return (
        <Route
            path={props.from}
            render={() => {
                window.location.replace(props.to);

                return null;
            }}
        />
    );
};
