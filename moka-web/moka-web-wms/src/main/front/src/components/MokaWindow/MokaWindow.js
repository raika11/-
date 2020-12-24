import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

const MokaWindow = ({ children, title = '', option = 'width=600,height=400' }) => {
    const containerEl = useRef(document.createElement('div'));
    const externalWindow = useRef(null);

    useEffect(() => {
        externalWindow.current = window.open('', title, option);
        const currentWindow = externalWindow.current;
        if (currentWindow) {
            currentWindow.document.body.appendChild(containerEl.current);
            return () => {
                currentWindow.close();
            };
        }
    }, [option, title]);

    return createPortal(children, containerEl.current);
};

export default MokaWindow;
