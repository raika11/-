import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput } from '@components';

const PageChildAdSearch = () => {
    return (
        <Form>
            <Form.Group as={Row}>
                <Form.Label column xs={1} className="px-0">
                    구분
                </Form.Label>
                <Col xs={3} className="px-0 pl-3">
                    <Form.Control as="select" custom>
                        <option>전체</option>
                    </Form.Control>
                </Col>
                <Col xs={8} className="px-0 pl-2">
                    <MokaSearchInput disabled />
                </Col>
            </Form.Group>
            <Form.Group className="d-flex justify-content-end">
                <Button variant="dark">광고 추가</Button>
            </Form.Group>
        </Form>
    );
};

export default PageChildAdSearch;
