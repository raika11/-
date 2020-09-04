/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import WmsMessageBoxContainer from './WmsMessageBoxContainer';
import { eventManager } from './eventManager';
import { TYPE, ACTION, POSITION } from './constants';

const containers = new Map();
let latestInstance = null;
let containerDomNode = null;
let containerConfig = {};
let queue = [];
let lazy = true;

const isAnyContainerMounted = () => {
    return containers.size > 0;
};

/**
 * Merge provided options with the defaults settings and generate the toastId
 */
function mergeOptions(options, type) {
    return { ...options, type };
}

/**
 * If the container is not mounted, the MessageBox is enqueued and
 * the container lazy mounted
 */
function dispatchMessageBox(content, options) {
    if (isAnyContainerMounted()) {
        eventManager.emit(ACTION.SHOW, content, options);
    } else {
        queue.push({ action: ACTION.SHOW, content, options });
        if (lazy) {
            lazy = false;
            containerDomNode = document.createElement('div');
            document.body.appendChild(containerDomNode);
            ReactDOM.render(<WmsMessageBoxContainer {...containerConfig} />, containerDomNode);
        }
    }

    return options.toastId;
}

class WmsMessageBox {
    static alert = (content, options) => {
        setTimeout(() => {
            dispatchMessageBox(
                content,
                mergeOptions(options, (options && options.type) || TYPE.ALERT)
            );
        }, 1);
    };

    static wait = (content) => {
        const options = {};
        options.closeButton = false;
        options.type = TYPE.WAIT;
        setTimeout(() => {
            dispatchMessageBox(content, options);
        }, 1);
    };

    static confirm = (content, okCallback) => {
        const buttons = [];
        buttons.push({
            name: '예',
            className: 'primary',
            handleClick() {
                WmsMessageBox.close(okCallback);
            }
        });
        buttons.push({
            name: '아니오',
            className: 'secondary',
            handleClick() {
                WmsMessageBox.close();
            }
        });
        const options = { buttons, closeButton: true };

        setTimeout(() => {
            dispatchMessageBox(content, mergeOptions(options, TYPE.CONFIRM));
        }, 1);
    };

    static show = (content) => {
        const buttons = [];
        buttons.push({
            name: '확인',
            className: 'primary',
            handleClick() {
                WmsMessageBox.close();
            }
        });
        const options = { buttons, closeButton: true };

        setTimeout(() => {
            dispatchMessageBox(content, mergeOptions(options, TYPE.DEFAULT));
        });
    };

    static close = (callback, delay) => {
        setTimeout(() => {
            WmsMessageBox.dismiss();
            if (callback) {
                callback();
            }
        }, delay);
    };
}

/**
 * Remove WmsMessageBox programmaticaly
 */
WmsMessageBox.dismiss = () => isAnyContainerMounted() && eventManager.emit(ACTION.CLOSE, null);

/**
 * return true if one container is displaying the WmsMessageBox
 */
WmsMessageBox.isActive = (id) => {
    let isMessageBoxActive = false;

    if (containers.size > 0) {
        containers.forEach((container) => {
            if (container.isMessageBoxActive()) {
                isMessageBoxActive = true;
            }
        });
    }

    return isMessageBoxActive;
};

/**
 * Track changes. The callback get the number of WmsMessageBox displayed
 */
WmsMessageBox.onChange = (callback) => {
    if (typeof callback === 'function') {
        eventManager.on(ACTION.ON_CHANGE, callback);
    }
};

/**
 * Configure the WmsMessageBoxContainer when lazy mounted
 */
WmsMessageBox.configure = (config) => {
    lazy = true;
    containerConfig = config;
};

WmsMessageBox.POSITION = POSITION;
WmsMessageBox.TYPE = TYPE;

/**
 * Wait until the WmsMessageBoxContainer is mounted to dispatch the WmsMessageBox
 * and attach isActive method
 */
eventManager
    .on(ACTION.DID_MOUNT, (containerInstance) => {
        latestInstance = containerInstance.props.containerId || containerInstance;
        containers.set(latestInstance, containerInstance);

        queue.forEach((item) => {
            eventManager.emit(item.action, item.content, item.options);
        });

        queue = [];
    })
    .on(ACTION.WILL_UNMOUNT, (containerInstance) => {
        if (containerInstance) {
            containers.delete(containerInstance.props.containerId || containerInstance);
        } else containers.clear();

        if (containers.size === 0) {
            eventManager.off(ACTION.SHOW).off(ACTION.CLOSE);
        }

        if (containerDomNode) {
            document.body.removeChild(containerDomNode);
        }
    });

export default WmsMessageBox;
