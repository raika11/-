import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { MokaModal } from '@components';
import AlertComponet from './AlertComponent';
import MokaTabComponent from './MokaTabComponent';
import AccordionComponent from './AccordionComponent';
import BreadcrumbComponent from './BreadcrumbComponent';
import ImageComponent from './ImageComponent';
// import avatar from './img/avatars/logo192.png';
import PopoverComponent from './PopoverComponent';
import TooltipComponent from './TooltipComponent';
import BadgeComponent from './BadgeComponent';
import DropdownComponent from './DropdownComponent';
import PaginationComponent from './PaginationComponent';
import ProgressBarComponent from './ProgressBarComponent';
import SpinnerComponent from './SpinnerComponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@moka/fontawesome-pro-solid-svg-icons';
import { MokaIconTabs } from '@/components/MokaTabs';

const placements = ['right', 'left', 'top', 'bottom'];
const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'light', 'info', 'dark'];

const TestBoardPgae = () => {
    // modal test
    const [showD, setShowD] = useState(false);
    const [expansionState, setExpansionState] = useState(true);

    /**
     * 탭 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleTabExpansion = () => {
        setExpansionState();
    };

    return (
        <Container>
            <Row>
                <Col md="6">
                    <Card>
                        <Card.Header className="mb-0">Alert</Card.Header>
                        <Card.Body>
                            <div className="mb-2">
                                {variants.map((variant, idx) => (
                                    <AlertComponet key={idx} variant={variant} children={`test-${variant}`} />
                                ))}
                            </div>
                            <div>
                                {variants.map((variant, idx) => (
                                    <AlertComponet key={idx} variant={variant} title={`title-${variant}`} children={`title-test-${variant}`} />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Modal</Card.Header>
                        <Card.Body>
                            {/* Modal */}
                            <Button className="mr-2" onClick={() => setShowD(true)}>
                                드래그 모달
                            </Button>
                            <MokaModal show={showD} onHide={() => setShowD(false)} title="드래그가능한 모달">
                                <div>
                                    <h1>드래그 가능한 모달</h1>
                                </div>
                            </MokaModal>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Tabs</Card.Header>
                        <Card.Body>
                            <MokaTabComponent
                                tab={[
                                    { eventKey: 'first', title: 'TEST 1', content: 'TEST 1' },
                                    { eventKey: 'second', title: 'TEST 2', content: 'TEST 2' },
                                    { eventKey: 'third', title: 'TEST 3', content: 'TEST 3' },
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
                                        content: 'Test Accordion 1',
                                    },
                                    {
                                        eventKey: '1',
                                        title: 'Test 2',
                                        content: 'Test Accordion 2',
                                    },
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
                        <Card.Header className="mb-0">Images</Card.Header>
                        {/* <Card.Body>
                            <ImageComponent src={avatar} thumbnail />
                        </Card.Body> */}
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Popover</Card.Header>
                        <Card.Body>
                            {placements.map((placement, idx) => (
                                <PopoverComponent
                                    key={idx}
                                    placement={placement}
                                    title={`test-${placement}`}
                                    children={`test-${placement}`}
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
                                    children={`test-${placement}`}
                                    buttonTitle={placement}
                                    className="m-1"
                                />
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <Card.Header className="mb-0">Badges</Card.Header>
                        <Card.Body>
                            <div className="mb-1">
                                {variants.map((variant, idx) => (
                                    <BadgeComponent key={idx} title="test" variant={variant} className="mr-1" />
                                ))}
                            </div>
                            <div>
                                {variants.map((variant, idx) => (
                                    <BadgeComponent key={idx} pill title="test" variant={variant} className="mr-1" />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Dropdowns</Card.Header>
                        <Card.Body>
                            <DropdownComponent
                                variant="warning"
                                title="드랍다운 버튼"
                                items={[
                                    { eventKey: '1', title: 'TEST 1' },
                                    { eventKey: '2', title: 'TEST 2' },
                                    { eventKey: '3', title: 'TEST 3' },
                                    { eventKey: '4', title: 'TEST 4' },
                                    { eventKey: '5', title: 'TEST 5' },
                                ]}
                                className="mb-2"
                            />
                            <DropdownComponent
                                variant="warning"
                                title="드랍다운 헤더"
                                header
                                headerTitle="헤더 테스트"
                                items={[
                                    { eventKey: '1', title: 'TEST 1' },
                                    { eventKey: '2', title: 'TEST 2' },
                                    { eventKey: '3', title: 'TEST 3' },
                                    { eventKey: '4', title: 'TEST 4' },
                                    { eventKey: '5', title: 'TEST 5' },
                                ]}
                            />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Pagination</Card.Header>
                        <Card.Body>
                            <PaginationComponent size="sm" />
                            <PaginationComponent />
                            <PaginationComponent size="lg" />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Progress Bars</Card.Header>
                        <Card.Body>
                            <ProgressBarComponent now={30} className="mb-2" />
                            <ProgressBarComponent now={50} striped className="mb-2" />
                            <ProgressBarComponent now={70} animated className="mb-2" />
                            <ProgressBarComponent
                                multi={[
                                    { now: 60, striped: true, variant: 'primary' },
                                    { now: 20, animated: true, variant: 'secondary' },
                                    { now: 20, striped: true, variant: 'success' },
                                ]}
                            />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Spinners</Card.Header>
                        <Card.Body>
                            <div>
                                {variants.map((variant, idx) => (
                                    <SpinnerComponent key={idx} animation="border" variant={variant} className="mb-2" />
                                ))}
                            </div>
                            <div>
                                {variants.map((variant, idx) => (
                                    <SpinnerComponent key={idx} animation="border" variant={variant} size="sm" className="mb-2" />
                                ))}
                            </div>
                            <div>
                                {variants.map((variant, idx) => (
                                    <SpinnerComponent key={idx} animation="grow" variant={variant} className="mb-2" />
                                ))}
                            </div>
                            <div>
                                {variants.map((variant, idx) => (
                                    <SpinnerComponent key={idx} animation="grow" variant={variant} size="sm" className="mb-2" />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header className="mb-0">Icon toggle</Card.Header>
                        <Card.Body>
                            <MokaIconTabs
                                tabNavPosition="left"
                                tabNavWidth={300}
                                expansion={expansionState}
                                onExpansion={handleTabExpansion}
                                tabs={[
                                    <Card>
                                        <Card.Body>탭컨텐츠1</Card.Body>
                                    </Card>,
                                    <Card>
                                        <Card.Body>탭컨텐츠2</Card.Body>
                                    </Card>,
                                    <Card>
                                        <Card.Body>탭컨텐츠3</Card.Body>
                                    </Card>,
                                ]}
                                tabNavs={[
                                    { title: '버튼1', icon: <FontAwesomeIcon icon={faCoffee} /> },
                                    { title: '버튼2', icon: <FontAwesomeIcon icon={faCoffee} /> },
                                    { title: '버튼3', icon: <FontAwesomeIcon icon={faCoffee} /> },
                                ]}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TestBoardPgae;
