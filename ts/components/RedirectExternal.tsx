import React from 'react';
import { Route } from 'react-router-dom';

interface RedirectExternalProps {
    to: string;
    from: string;
}

export default function RedirectExternal(props: RedirectExternalProps) {
    return (
        <Route
            path={props.from}
            render={() => {
                window.location.replace(props.to);

                return null;
            }}
        />
    );
}
