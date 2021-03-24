import React from 'react';
import Button from 'react-bootstrap/Button';

// 팟티 채널 새창 이동 버튼
export const ChannelMoveButtonRenderer = ({ shareUrl }) => {
    const handleClickMoveButton = () => {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className="h-100 d-flex jutify-content-center align-items-center">
            <Button variant="outline-table-btn" size="sm" onClick={handleClickMoveButton}>
                이동
            </Button>
        </div>
    );
};
