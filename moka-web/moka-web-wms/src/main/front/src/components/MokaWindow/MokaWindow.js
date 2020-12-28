import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    /**
     * show
     * @default false
     */
    show: PropTypes.bool,
    /**
     * onHide
     */
    onHide: PropTypes.func,
    /**
     * window.open 타이틀
     */
    title: PropTypes.string,
    /**
     * window.open option
     */
    option: PropTypes.string,
};
const defaultProps = {
    show: false,
};

/**
 * window.open 으로 열리는 MokaWindow 컴포넌트
 */
const MokaWindow = ({ show, onHide, children, title = '', option = 'width=600,height=400' }) => {
    const [containerEl] = useState(() => document.createElement('div'));
    const [externalWindow, setExternalWindow] = useState(null);

    const handleHide = useCallback(() => {
        if (externalWindow) {
            externalWindow.close();
            setExternalWindow(null);
        }

        if (onHide) {
            onHide();
        }
    }, [externalWindow, onHide]);

    const handleShow = useCallback(() => {
        const currentWindow = window.open('', title, option);
        setExternalWindow(currentWindow);

        currentWindow.document.body.appendChild(containerEl);
        currentWindow.onbeforeunload = handleHide;
    }, [containerEl, handleHide, option, title]);

    useEffect(() => {
        if (!show || !children) return;

        handleShow();
    }, [show, children, /* should never change: */ handleShow]);

    if (show) {
        return createPortal(children, containerEl);
    } else {
        return null;
    }
};

MokaWindow.propTypes = propTypes;
MokaWindow.defaultProps = defaultProps;

export default MokaWindow;
