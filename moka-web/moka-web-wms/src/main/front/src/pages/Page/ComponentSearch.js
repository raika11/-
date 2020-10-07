import React from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput } from '@components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@moka/fontawesome-pro-solid-svg-icons';

const ComponentSearch = () => {
    return (
        <Card bg="light">
            {/* 카드 헤더 */}
            <Card.Header>
                <Card.Title>컴포넌트 검색</Card.Title>
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
                    <Form.Group className="d-flex justify-content-end">
                        <Button>컴포넌트 추가</Button>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ComponentSearch;
