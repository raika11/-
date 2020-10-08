import React from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThList } from '@moka/fontawesome-pro-solid-svg-icons';
import { faThLarge } from '@moka/fontawesome-pro-solid-svg-icons';

import { MokaSearchInput } from '@components';

const PageChildTemplateList = () => {
    return (
        <Card>
            <Card.Header>
                <Card.Title className="h-100">템플릿 검색</Card.Title>
            </Card.Header>

            <Card.Body className="pt-10 pb-10">
                <Form>
                    <Form.Group as={Row} className="mb-10">
                        <Form.Control as="select" custom>
                            <option>중앙일보(https://joongang.joins.com/)</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-10">
                        <Col xs={7} className="pr-1 pr-0 pl-0">
                            <Form.Control as="select" custom>
                                <option>위치그룹</option>
                            </Form.Control>
                        </Col>
                        <Col xs={5} className="pl-1 pr-0 pl-0">
                            <Form.Control as="select" custom>
                                <option>사이즈 전체</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-10">
                        <Col xs={5} className="pr-1 pr-0 pl-0">
                            <Form.Control as="select" custom>
                                <option>템플릿 전체</option>
                            </Form.Control>
                        </Col>
                        <Col xs={7} className="pl-1 pr-0 pl-0">
                            <MokaSearchInput />
                        </Col>
                    </Form.Group>
                    <div className="d-flex mb-10">
                        <Nav as={ButtonGroup} size="sm" className="mr-auto" defaultActiveKey="1">
                            <Nav.Link eventKey="1" as={Button} variant="gray150">
                                <FontAwesomeIcon icon={faThList} />
                            </Nav.Link>
                            <Nav.Link eventKey="2" as={Button} variant="gray150">
                                <FontAwesomeIcon icon={faThList} />
                            </Nav.Link>
                        </Nav>
                        <div className="pt-0">
                            <Button variant="dark">템플릿 추가</Button>
                        </div>
                    </div>
                </Form>

                {/* <Tab></Tab> */}
            </Card.Body>
        </Card>
    );
};

export default PageChildTemplateList;
