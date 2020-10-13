import React from 'react';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MokaSearchInput } from '@components';

const PageSearch = () => {
    return (
        <Form>
            <Form.Group className="mb-2">
                <Form.Control as="select" custom>
                    <option>중앙일보</option>
                </Form.Control>
            </Form.Group>
            <Form.Group as={Row}>
                <Col xs={4} className="p-0 pr-2">
                    <Form.Control as="select" custom>
                        <option>페이지 전체</option>
                    </Form.Control>
                </Col>
                <Col xs={8} className="p-0">
                    <MokaSearchInput />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default PageSearch;
