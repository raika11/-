import React from 'react';
import { MokaInput, MokaSearchInput } from '@components';
import { Form, Col, Button } from 'react-bootstrap';

const RelationPollModalSearchComponent = () => {
    return (
        <>
            <Form.Row style={{ border: '1px solid #ddd' }} className="p-2 mb-2">
                <Col xs={4} className="d-flex align-items-center">
                    <Form.Label style={{ width: '100px' }} className="pr-2 mb-0 text-right">
                        분류
                    </Form.Label>
                    <MokaInput as="select">
                        <option>hh</option>
                        <option>aa</option>
                    </MokaInput>
                </Col>
                <Col xs={8} className="d-flex align-items-center">
                    <Form.Label style={{ width: '70px' }} className="pr-2  mb-0 text-right">
                        투표제목
                    </Form.Label>
                    <MokaSearchInput className="flex-fill"></MokaSearchInput>
                </Col>
            </Form.Row>
        </>
    );
};

export default RelationPollModalSearchComponent;
