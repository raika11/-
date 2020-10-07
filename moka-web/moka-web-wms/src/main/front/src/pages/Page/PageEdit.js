import React from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { MokaSearchInput } from '@components';

const PageEdit = () => {
    return (
        <>
            {/* 카드 바디 */}
            <Card.Body className="p-0">
                {/* 폼 */}
                <Form>
                    <Form.Group>
                        <Form.Control as="select" custom>
                            <option>중앙일보(https://joongang.joins.com/)</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col md={4} className="px-0">
                            <Form.Control as="select" custom>
                                <option>페이지 전체</option>
                            </Form.Control>
                        </Col>
                        <Col md={8} className="px-0 pl-2">
                            <MokaSearchInput />
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </>
    );
};

export default PageEdit;
