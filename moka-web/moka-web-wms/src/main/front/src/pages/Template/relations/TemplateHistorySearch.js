import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInputLabel } from '@components';

const TemplateHistorySearch = () => {
    return (
        <Form>
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <MokaInputLabel label="구분" as="select" labelWidth={28} className="mb-0">
                        <option>전체</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={8} className="p-0 mb-0">
                    <MokaSearchInput />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default TemplateHistorySearch;
