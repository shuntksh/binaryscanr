/* tslint:disable:no-console */
import * as React from "react";

import * as css from "./ClearButton.css";

export interface CloseButtonProps {
    disabled: boolean;
    onClick?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
    style?: any;
}

export const CloseButton = (props: CloseButtonProps) => {
    const { disabled, onClick, style } = props;
    return (
        <div style={style}>
            <button type="button" className={css.clearButton} onClick={onClick} disabled={disabled} >
                ×
            </button>
        </div>
    );
};

export default CloseButton;
