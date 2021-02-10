import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaOverlayTooltipButton, MokaIcon } from '@components';

const ComponentLoadBox = ({ message, onClick }) => {
    return (
        <Form.Row className="justify-content-end">
            <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: message.replace('\n', ' ') }} />
            <MokaOverlayTooltipButton variant="outline-neutral" className="border ml-3" tooltipText="컴포넌트 리로드" onClick={onClick}>
                <MokaIcon iconName="far-redo-alt" />
            </MokaOverlayTooltipButton>
        </Form.Row>
    );
};

export default ComponentLoadBox;
