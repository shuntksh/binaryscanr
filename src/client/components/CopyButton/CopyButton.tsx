import * as React from "react";
import * as css from "./CopyButton.css";

// from: fontawesome
const CLIPBOARD_ICON = "M768 -128h896v640h-416q-40 0 -68 28t-28 68v416h-384v-1152zM1024 " +
    "1312v64q0 13 -9.5 22.5t-22.5 9.5h-704q-13 0 -22.5 -9.5t-9.5 -22.5v-64q0 -13 9.5 -22.5t22.5 " +
    "-9.5h704q13 0 22.5 9.5t9.5 22.5zM1280 640h299l-299 299v-299zM1792 512v-672q0 -40 -28 " +
    "-68t-68 -28 h-960q-40 0 -68 28t-28 68v160h-544q-40 0 -68 28t-28 68v1344q0 40 28 68t68 " +
    "28h1088q40 0 68 -28t28 -68v-328q21 -13 36 -28l408 -408q28 -28 48 -76t20 -88z";

const msg = {
    TOOLTIP_DEFAULT: "Click to copy",
    TOOLTIP_MSG_COPIED: "Copied!",
    TOOLTIP_MSG_FAILED: "Oops, something went wrong!",
    TOOLTIP_MSG_OOPS: "Oops, nothing to copy!",
};

export interface CopyButtonProps {
    style?: {};
    value: string;
}

export interface CopyButtonState {
    showOutline?: boolean; // Show outline of copy button only when focused by tab
    tooltip?: string;
}

export class CopyButton extends React.Component<CopyButtonProps, CopyButtonState> {
    public state: CopyButtonState = {
        showOutline: true,
        tooltip: msg.TOOLTIP_DEFAULT,
    };

    // Ref Handlers
    private buttonElement: HTMLButtonElement;
    private textareaElement: HTMLTextAreaElement;
    private refHandlers: any = {
        button:  (ref: HTMLButtonElement): void => { this.buttonElement = ref; },
        textarea: (ref: HTMLTextAreaElement): void => { this.textareaElement = ref; },
    };

    public componentDidMount() {
        this.setState({ showOutline: true });
    }

    public render() {
        const { showOutline } = this.state;
        return (
        <div style={this.props.style}>
            <button
                className={css.copyButton}
                style={{ outlineWidth: showOutline ? "5px" : "0" }}
                ref={this.refHandlers.button}
                onClick={this.copyToClipboard}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
            >
                <svg width="20px" viewBox="0 0 179.2 179.2">
                    <path
                        transform="scale(0.1, -0.1) translate(0,-1536)"
                        d={CLIPBOARD_ICON}
                        stroke="white"
                    />
                </svg>
            </button>
            <textarea
                tabIndex={-1}
                className={css.invisibleTextbox}
                ref={this.refHandlers.textarea}
            />
        </div>
        );
    }

    private handleMouseDown = (): void => {
        this.setState({ showOutline: false });
    }

    private handleMouseUp = (): void => {
        this.buttonElement.blur();
        this.setState({ showOutline: true });
    }

    private updateTooltip = (tooltip: string): void => {
        this.setState({ tooltip });
    }

    private copyToClipboard = (): void => {
        if (!this.props.value) {
            this.updateTooltip(msg.TOOLTIP_MSG_OOPS);
            return;
        }
        this.textareaElement.value = this.props.value;
        this.textareaElement.select();
        try {
            if (document.execCommand("copy")) {
                this.updateTooltip(msg.TOOLTIP_MSG_COPIED);
            } else {
                throw new Error("Copy failed");
            }
        } catch (err) {
            // Try IE specific method as a fallback
            try {
                (window as any).clipboardData.setData("text", this.props.value);
            } catch (errIsInternetExplorer) {
                this.updateTooltip(msg.TOOLTIP_MSG_FAILED);
            }
        }
    }
}

export default CopyButton;
