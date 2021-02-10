import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaOverlayTooltipButton, MokaIcon } from '@components';

const ContainerLoadBox = ({ message, onClick }) => {
    return (
        <Form.Row className="justify-content-end align-items-center mb-2">
            <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: message.replace('\n', ' ') }} />
            <MokaOverlayTooltipButton variant="outline-neutral" className="border ml-3" tooltipText="컨테이너 리로드" onClick={onClick}>
                <MokaIcon iconName="far-redo-alt" />
            </MokaOverlayTooltipButton>
        </Form.Row>
    );
};

export default ContainerLoadBox;
