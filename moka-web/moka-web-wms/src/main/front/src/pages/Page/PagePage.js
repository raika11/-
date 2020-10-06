import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDoubleLeft } from '@moka/fontawesome-pro-solid-svg-icons';

const PagePage = () => {
    return (
        <Container fluid>
            <Row>
                <Col md={3} className="pl-0 pr-2">
                    <Card border="light" style={{ height: '804px' }}>
                        <Card.Body className="p-2">
                            <Card.Title className="d-flex justify-content-between">
                                <div>페이지 관리</div>
                                <FontAwesomeIcon icon={faChevronDoubleLeft} fixedWidth />
                            </Card.Title>
                            <Form.Group className="py-3">
                                <Form.Control as="select" className="mb-2">
                                    <option>중앙일보(https://joongang.joins.com/)</option>
                                </Form.Control>
                                <Form.Row>
                                    <Col md={4}>
                                        <Form.Control as="select">
                                            <option>페이지 전체</option>
                                        </Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Control placeholder="검색어를 입력하세요" />
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <div style={{ height: '645px' }} className="mt-4">
                                node
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5} className="pl-0 pr-2">
                    <Card border="light" style={{ height: '804px' }}>
                        <Card.Body>test</Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="px-0">
                    <Card border="light" style={{ height: '804px' }}>
                        <Card.Body>
                            <Card.Title className="d-flex justify-content-between">
                                <div>사이트 정보</div>
                                <FontAwesomeIcon icon={faChevronDoubleLeft} fixedWidth />
                            </Card.Title>
                            <ButtonGroup className="mb-2 ">
                                <Button>W3C</Button>
                                <Button>미리보기</Button>
                                <Button>즉시반영</Button>
                                <Button>전송</Button>
                                <Button>삭제</Button>
                            </ButtonGroup>

                            <Form.Row>
                                <Col md={4}>
                                    <Form.Control as="select">
                                        <option>페이지 전체</option>
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control placeholder="검색어를 입력하세요" />
                                </Col>
                            </Form.Row>
                            <div style={{ height: '645px' }} className="border-gray mt-4">
                                node
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PagePage;
