import React from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';

import { MokaSearchInput } from '@components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@moka/fontawesome-pro-solid-svg-icons';
import { faThList } from '@moka/fontawesome-pro-solid-svg-icons';
import { faThLarge } from '@moka/fontawesome-pro-solid-svg-icons';

const TemplateSearch = () => {
    return (
        <Card bg="light">
            {/* 카드 헤더 */}
            <Card.Header>
                <Card.Title>광고 검색</Card.Title>
            </Card.Header>

            {/* 카드 바디 */}
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Control as="select" custom>
                            <option>중앙일보(https://joongang.joins.com/)</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col md={7} className="px-0">
                            <Form.Control as="select" custom>
                                <option>위치그룹</option>
                            </Form.Control>
                        </Col>
                        <Col md={5} className="px-0 pl-2">
                            <Form.Control as="select" custom>
                                <option>사이즈 전체</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col md={5} className="px-0 pr-2">
                            <Form.Control as="select" custom>
                                <option>템플릿 전체</option>
                            </Form.Control>
                        </Col>
                        <Col md={7} className="px-0">
                            <MokaSearchInput />
                        </Col>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-between">
                        <Nav variant="pills" defaultActiveKey="1">
                            <Nav.Item>
                                <Nav.Link eventKey="1">
                                    <FontAwesomeIcon icon={faThList} />
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2">
                                    <FontAwesomeIcon icon={faThLarge} />
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Button>템플릿 추가</Button>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TemplateSearch;
