import React from 'react';
import { MokaOverlayTooltipButton, MokaIcon } from '@components';

const ComponentLoadBox = ({ message, onClick }) => {
    return (
        <div className="d-flex justify-content-end mb-2">
            <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: message.replace('\n', ' ') }} />
            <MokaOverlayTooltipButton variant="outline-neutral" size="sm" className="border ml-3" tooltipText="컴포넌트 리로드" onClick={onClick}>
                <MokaIcon iconName="far-redo-alt" />
            </MokaOverlayTooltipButton>
        </div>
    );
};

export default ComponentLoadBox;
