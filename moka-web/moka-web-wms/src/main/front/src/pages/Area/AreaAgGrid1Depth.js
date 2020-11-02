import React from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput } from '@components';

const AreaAgGrid1Depth = () => {
    return (
        <MokaCard header={false} width={280}>
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0">
                    <MokaInput as="select">
                        <option>전체</option>
                    </MokaInput>
                </Col>
                <Col xs={7} className="p-0 d-flex justify-content-end">
                    <Button variant="dark">추가</Button>
                </Col>
            </Form.Row>
        </MokaCard>
    );
};

export default AreaAgGrid1Depth;
