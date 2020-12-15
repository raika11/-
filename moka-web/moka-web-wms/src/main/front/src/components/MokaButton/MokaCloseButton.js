import React from 'react';

/**
 * Modal에서 쓰이는 close button html
 */
const MokaCloseButton = ({ onClick }) => {
    return (
        <button type="button" className="close" onClick={onClick}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
        </button>
    );
};

export default MokaCloseButton;
