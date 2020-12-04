import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaOverlayTooltipButton, MokaIcon } from '@components';

const ContainerLoadBox = ({ message, onClick }) => {
    return (
        <Form.Row className="mb-2">
            <Col xs={2} className="p-0"></Col>
            <Col xs={8} className="p-0 pl-2">
                <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: message.replace('\n', '<br/>') }} />
            </Col>
            <Col xs={2} className="p-0 d-flex align-items-center justify-content-start">
                <MokaOverlayTooltipButton variant="outline-neutral" className="border" tooltipText="컨테이너 리로드" onClick={onClick}>
                    <MokaIcon iconName="far-redo-alt" />
                </MokaOverlayTooltipButton>
            </Col>
        </Form.Row>
    );
};

export default ContainerLoadBox;
