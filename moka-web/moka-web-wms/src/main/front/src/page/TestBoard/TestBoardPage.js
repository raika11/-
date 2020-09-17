import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AlertComponet from './AlertComponent';
import { MokaDraggableModal } from '@component';
import MokaTabComponent from './MokaTabComponent';
import AccordionComponent from './AccordionComponent';
import BreadcrumbComponent from './BreadcrumbComponent';
import PopoverComponent from './PopoverComponent';
import TooltipComponent from './TooltipComponent';
import BadgeComponent from './BadgeComponent';

const placements = ['right', 'left', 'top', 'bottom'];
const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'light', 'info', 'dark'];

const TestBoardPgae = () => {
    // modal test
    const [showD, setShowD] = useState(false);

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
                            {/* Modal */}
                            <Button className="mr-2" onClick={() => setShowD(true)}>
                                드래그 모달
                            </Button>
                            <MokaDraggableModal
                                show={showD}
                                onHide={() => setShowD(false)}
                                title="드래그가능한 모달"
                            >
                                <div>
                                    <h1>드래그 가능한 모달</h1>
                                </div>
                            </MokaDraggableModal>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Tabs</Card.Header>
                        <Card.Body>
                            <MokaTabComponent
                                tab={[
                                    { eventKey: 'first', title: 'TEST 1', content: 'TEST 1' },
                                    { eventKey: 'second', title: 'TEST 2', content: 'TEST 2' },
                                    { eventKey: 'third', title: 'TEST 3', content: 'TEST 3' }
                                ]}
                            />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Accordion</Card.Header>
                        <Card.Body>
                            <AccordionComponent
                                card={[
                                    {
                                        eventKey: '0',
                                        title: 'Test 1',
                                        content: 'Test Accordion 1'
                                    },
                                    {
                                        eventKey: '1',
                                        title: 'Test 2',
                                        content: 'Test Accordion 2'
                                    }
                                ]}
                            />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Breadcrumb</Card.Header>
                        <Card.Body>
                            <BreadcrumbComponent />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Popover</Card.Header>
                        <Card.Body>
                            {placements.map((placement, idx) => (
                                <PopoverComponent
                                    key={idx}
                                    placement={placement}
                                    title={`test-${placement}`}
                                    content={`test-${placement}`}
                                    buttonTitle={placement}
                                    className="m-1"
                                />
                            ))}
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Tooltips</Card.Header>
                        <Card.Body>
                            {placements.map((placement, idx) => (
                                <TooltipComponent
                                    key={idx}
                                    placement={placement}
                                    title={`test-${placement}`}
                                    content={`test-${placement}`}
                                    buttonTitle={placement}
                                    className="m-1"
                                />
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="6">
                    <Card>
                        <Card.Header className="mb-0">Badges</Card.Header>
                        <Card.Body>
                            <div className="mb-1">
                                {variants.map((variant, idx) => (
                                    <BadgeComponent
                                        key={idx}
                                        title="test"
                                        variant={variant}
                                        className="mr-1"
                                    />
                                ))}
                            </div>
                            <div>
                                {variants.map((variant, idx) => (
                                    <BadgeComponent
                                        key={idx}
                                        pill
                                        title="test"
                                        variant={variant}
                                        className="mr-1"
                                    />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Dropdowns</Card.Header>
                        <Card.Body></Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TestBoardPgae;
