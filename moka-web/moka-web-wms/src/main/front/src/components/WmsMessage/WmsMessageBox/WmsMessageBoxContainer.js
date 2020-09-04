/* eslint-disable */
import React, { Component, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { ACTION, isValidDelay, POSITION, objectValues, falseOrDelay, TYPE } from './constants';
import spinner from '~/assets/images/icon/spinner.gif';
import { eventManager } from './eventManager';

class MessageBoxContainer extends Component {
    static propTypes = {
        /**
         * Set message box position
         */
        position: PropTypes.oneOf(objectValues(POSITION)),

        /**
         * Disable or set autoClose delay
         */
        autoClose: falseOrDelay,

        /**
         * Hide or not progress bar when autoClose is enabled
         */
        hideProgressBar: PropTypes.bool,

        /**
         * Pause message box duration on hover
         */
        pauseOnHover: PropTypes.bool,

        /**
         * Dismiss message box on click
         */
        closeButton: PropTypes.bool,

        /**
         * Newest on top
         */
        newestOnTop: PropTypes.bool,

        /**
         * An optional className
         */
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

        /**
         * An optional style
         */
        style: PropTypes.object
    };

    static defaultProps = {
        position: POSITION.CENTER,
        rtl: false,
        autoClose: 5000,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        closeButton: true,
        newestOnTop: false,
        draggable: true,
        draggablePercent: 80,
        className: null,
        style: null,
        toastClassName: null,
        bodyClassName: null,
        progressClassName: null,
        progressStyle: null,
        role: 'alert',
        maxWidth: 'sm',
        fullWidth: true
    };

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            content: null,
            title: '알림',
            options: {}
        };
    }

    componentDidMount() {
        eventManager
            .on(ACTION.SHOW, (content, options) => this.buildMessageBox(content, options))
            .on(ACTION.CLOSE, () => this.clear())
            .emit(ACTION.DID_MOUNT, this);
    }

    componentWillUnmount() {
        eventManager.emit(ACTION.WILL_UNMOUNT, this);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    isMessageBoxActive = () => this.state.modal;

    removeMessageBox() {
        this.setState(
            {
                modal: false
            },
            this.dispatchChange
        );
    }

    dispatchChange() {
        eventManager.emit(ACTION.ON_CHANGE);
    }

    renderModalFooter(buttons) {
        if (buttons) {
            return (
                <DialogActions>
                    {buttons.map((button) => (
                        <Button
                            key={button.name}
                            color={button.className}
                            onClick={button.handleClick}
                        >
                            {button.name}{' '}
                        </Button>
                    ))}
                </DialogActions>
            );
        }
    }

    getAutoCloseDelay(messageAutoClose) {
        return messageAutoClose === false || isValidDelay(messageAutoClose)
            ? messageAutoClose
            : this.props.autoClose;
    }

    canBeRendered(content) {
        return (
            isValidElement(content) ||
            typeof content === 'string' ||
            typeof content === 'number' ||
            typeof content === 'function'
        );
    }

    parseClassName(prop) {
        if (typeof prop === 'string') {
            return prop;
        }
        if (prop !== null && typeof prop === 'object' && 'toString' in prop) {
            return prop.toString();
        }

        return null;
    }

    buildMessageBox(content, { delay, ...options }) {
        if (!this.canBeRendered(content)) {
            throw new Error(
                `The element you provided cannot be rendered. You provided an element of type ${typeof content}`
            );
        }

        const closeMessageBox = () => this.removeMessageBox();
        const messageOptions = {
            key: options.key || this.messageKey++,
            type: options.type,
            closeMessageBox,
            position: options.position || this.props.position,
            className: this.parseClassName(options.className || this.props.messageClassName),
            bodyClassName: this.parseClassName(options.bodyClassName || this.props.bodyClassName),
            onClick: options.onClick || this.props.onClick,
            modalFooter: this.renderModalFooter(options.buttons),
            closeButton:
                typeof options.closeButton === 'boolean'
                    ? options.closeButton
                    : this.props.closeButton,
            autoClose: this.getAutoCloseDelay(options.autoClose),
            fullWidth: this.props.fullWidth,
            maxWidth: this.props.maxWidth
        };

        typeof options.onOpen === 'function' && (messageOptions.onOpen = options.onOpen);

        typeof options.onClose === 'function' && (messageOptions.onClose = options.onClose);

        // add closeMessageBox function to react component only
        if (
            isValidElement(content) &&
            typeof content.type !== 'string' &&
            typeof content.type !== 'number'
        ) {
            content = cloneElement(content, {
                closeMessageBox
            });
        } else if (typeof content === 'function') {
            content = content({ closeMessageBox });
        }

        if (delay) {
            setTimeout(() => {
                this.showMessageBox(messageOptions, content);
            }, delay);
        } else {
            this.showMessageBox(messageOptions, content);
        }
    }

    showMessageBox(options, content) {
        this.setState(
            {
                modal: true,
                content,
                options
            },
            this.dispatchChange
        );
    }

    clear = () => {
        this.setState({ modal: false });
    };

    render() {
        return (
            <Dialog
                open={this.state.modal}
                fullWidth={this.state.options.fullWidth}
                maxWidth={this.state.options.maxWidth}
            >
                <DialogTitle
                    onClose={
                        this.state.options.closeButton ? this.state.options.closeMessageBox : null
                    }
                >
                    {this.state.title}
                </DialogTitle>
                <DialogContent>
                    {this.state.options.type === TYPE.WAIT && <img src={spinner} />}{' '}
                    {this.state.content}
                </DialogContent>
                {this.state.options.modalFooter}
            </Dialog>
        );
    }
}

export default MessageBoxContainer;
