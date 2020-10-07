import React from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MokaSearchInput } from '@components';

const PageHistoryList = () => {
    return (
        <Card>
            {/* 카드 헤더 */}
            <Card.Header>
                <Card.Title className="h-100">페이지 히스토리</Card.Title>
            </Card.Header>

            {/* 카드 바디 */}
            <Card.Body>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column md={1} className="px-0">
                            구분
                        </Form.Label>
                        <Col md={3} className="px-0 pl-3">
                            <Form.Control as="select" custom>
                                <option>전체</option>
                            </Form.Control>
                        </Col>
                        <Col md={8} className="px-0 pl-2">
                            <MokaSearchInput />
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PageHistoryList;
