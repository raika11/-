import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { MokaIcon, MokaInput } from '@components';

const RelationPollInfoComponent = ({ id, title, onDelete }) => {
    const handleClickDelete = (index) => {
        onDelete(index);
    };

    return (
        <Form.Row className="pb-2">
            <Col xs={3} className="pr-0 pl-5 d-flex align-content-center">
                <MokaInput value={id} disabled={true} />
            </Col>
            <Col xs={8} className="pl-0 d-flex align-items-center">
                <MokaInput value={title} disabled={true} />
            </Col>
            <Col xs={1} className="d-flex align-items-center">
                <Button size="sm" variant="negative" onClick={() => handleClickDelete(id)}>
                    <MokaIcon iconName="fal-minus" />
                </Button>
            </Col>
        </Form.Row>
    );
};

export default RelationPollInfoComponent;
