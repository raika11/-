import React from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import AlertComponet from '../TestBoard/AlertComponent';
import { MokaDraggableModal, MokaResizableModal } from '@component';
import { MokaControlledTabs } from '@/component';

const TestBoardPgae = () => {
    return (
        <Container>
            <Row>
                <Col lg="6">
                    <Card>
                        <Card.Header className="mb-0">Alert</Card.Header>
                        <Card.Body>
                            <AlertComponet />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Modal</Card.Header>
                        <Card.Body>
                            <MokaDraggableModal
                                btnTitle="드래그 모달"
                                title="Draggable-modal-test"
                                content="테스트"
                            />
                            <MokaResizableModal
                                btnTitle="리사이즈 모달"
                                title="Resizeable-modal-test"
                                content="테스트"
                            />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Tabs</Card.Header>
                        <Card.Body>
                            <MokaControlledTabs />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TestBoardPgae;
