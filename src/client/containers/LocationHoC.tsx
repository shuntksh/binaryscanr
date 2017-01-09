import * as React from "react";

/**
 * @description
 * A Higher-Order Component that read and set window.location based on current
 * app state. Also update state base on location change.
 */
export default function locationHoC <Props, State, ComponentState>(
    WrappedComponent: typeof React.Component,
): typeof React.Component {
    return (class LocationWrapper extends React.Component<Props & State, ComponentState> {
        public render() {
            return <WrappedComponent {...this.props} {...this.state} />;
        }
    });
}
