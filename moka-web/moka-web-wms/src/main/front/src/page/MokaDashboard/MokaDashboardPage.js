import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const MokaDashboardPage = () => {
    return (
        <Container fluid className="p-0">
            <Row>
                <Col lg="6">
                    <h1 className="h3 mb-3">Basic Inputs</h1>
                    <Card>
                        <Card.Header className="mb-0">Input</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>1) 기본 텍스트 인풋</Form.Label>
                                    <Form.Control placeholder="입력창입니다" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>2) Textarea</Form.Label>
                                    <Form.Control as="textarea" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>3) Select</Form.Label>
                                    <Form.Control as="select" custom className="mb-3">
                                        <option>옵션1</option>
                                        <option>옵션2</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="6">
                    <h1 className="h3 mb-3">Advanced Inputs</h1>
                    <Card>
                        <Card.Header className="mb-0"></Card.Header>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MokaDashboardPage;
