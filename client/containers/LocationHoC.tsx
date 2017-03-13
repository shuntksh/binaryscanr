import * as React from "react";

/**
 * @description
 * A Higher-Order Component that read and set window.location based on current
 * app state. Also update state base on location change.
 */
export default function locationHoC <P>(
    WrappedComponent: React.ComponentClass<P>,
): React.ComponentClass<P> {
    return (class LocationWrapper extends React.Component<P, {}> {
        public render() {
            return <WrappedComponent {...(this.props as P)} />;
        }
    });
}
