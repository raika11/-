import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaIcon } from '@components';
import { Button, Col } from 'react-bootstrap';

const ABStatusRow = ({ modDt, onCopy }) => {
    return (
        <Form.Row className="d-flex mb-2 align-items-center justify-content-between">
            <Col xs={6}>
                <MokaIcon iconName="fas-circle" fixedWidth className="color-neutral mr-2" />
                <span className="mr-32">대기</span>
                <span>수정일시 : {modDt}</span>
            </Col>
            <Col xs={6} className="text-right">
                <Button variant="outline-primary mr-2" onClick={onCopy}>
                    복사
                </Button>
                <Button variant="outline-dark">종료</Button>
            </Col>
        </Form.Row>
    );
};

export default ABStatusRow;
