import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput } from '@components';

const PageHistorySearch = () => {
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
                    <MokaSearchInput />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default PageHistorySearch;
