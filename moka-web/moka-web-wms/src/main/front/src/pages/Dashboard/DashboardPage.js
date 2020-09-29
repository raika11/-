import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import InputMask from 'react-input-mask';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Carousel from 'react-bootstrap/Carousel';
import ListGroup from 'react-bootstrap/ListGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { toastr } from 'react-redux-toastr';

import { MokaDateTimePicker, MokaDraggableModal, MokaCodeListModal, MokaAutocomplete, MokaPrependLinkInput, MokaSearchInput, MokaCardTabs, MokaAlert } from '@components';
import { MokaImageInput } from '@components/MokaInput';
import { options } from './data';
import Table from './TableTest';
import { changeTheme } from '@store/layout/layoutAction';
import bg from '@assets/images/bg.jpeg';

const MokaDashboardPage = () => {
    const [checked, setChecked] = useState(true);
    const [multiSelectValue, setMultiSelectValue] = useState([]);

    // modal test
    const [showD, setShowD] = useState(false);
    const [showLMS, setShowLMS] = useState(false);
    // table
    const [fixedTable, setFixedTable] = useState(false);

    const dispatch = useDispatch();

    return (
        <Container fluid className="p-0">
            <Row>
                <Col>
                    <MokaCardTabs id="test" tabNavs={['Tab1', 'Tab2']} tabs={[<div>Test1</div>, <div>Test2</div>]} />
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Nav variant="pills" defaultActiveKey="nav-1">
                                <Nav.Item>
                                    <Nav.Link eventKey="nav-1">링크1</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="nav-2">링크2</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link href="#">링크3</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>카드 타이틀</Card.Title>
                            <Card.Subtitle>카드 서브타이틀</Card.Subtitle>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text className="mb-4">
                                본문 안에서 텍스트<Card.Link href="#">링크</Card.Link>
                            </Card.Text>
                            <ButtonToolbar className="mb-4">
                                <ButtonGroup className="mr-2">
                                    <Button>그룹버튼1</Button>
                                    <Button>그룹버튼2</Button>
                                    <Button>그룹버튼3</Button>
                                </ButtonGroup>
                                <ButtonGroup className="mr-2">
                                    <Button variant="success">다른 그룹버튼1</Button>
                                    <Button variant="success">다른 그룹버튼2</Button>
                                    <Button variant="success">다른 그룹버튼3</Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                            <Row className="mb-3">
                                <Col xs={2}>
                                    <Carousel>
                                        <Carousel.Item>
                                            <img className="d-block w-100" src={bg} alt="t" />
                                            <Carousel.Caption>
                                                <h3>First slide label</h3>
                                                <p>서브 텍스트</p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img className="d-block w-100" src={bg} alt="t" />
                                            <Carousel.Caption>
                                                <h3>Second slide label</h3>
                                                <p>서브 텍스트</p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    </Carousel>
                                </Col>
                                <Col xs={3}>
                                    <ListGroup as="ul">
                                        <ListGroup.Item as="li" active>
                                            액티브 아이템
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li">아이템</ListGroup.Item>
                                        <ListGroup.Item as="li" variant="info">
                                            아이템
                                        </ListGroup.Item>
                                        <ListGroup.Item as="li" disabled>
                                            사용불가 아이템
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col xs={7}>
                                    <Jumbotron>
                                        <h1>TEST</h1>
                                        <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                                        <p>
                                            <Button variant="primary">Learn more</Button>
                                        </p>
                                    </Jumbotron>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg="6">
                    <h1 className="h3 mb-3">Basic Inputs</h1>
                    <Card>
                        <Card.Header>
                            <Card.Title tag="h5" className="mb-0">
                                Form
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                {/* text input */}
                                <Form.Group>
                                    <Form.Label>1) 기본 텍스트 인풋</Form.Label>
                                    <Form.Control placeholder="입력창입니다" />
                                </Form.Group>

                                {/* inline text input */}
                                <Form.Row>
                                    <Form.Label column xs={2}>
                                        1) 기본 텍스트 인풋
                                    </Form.Label>
                                    <Col xs={10}>
                                        <Form.Control placeholder="입력창입니다" />
                                    </Col>
                                </Form.Row>

                                {/* textarea */}
                                <Form.Group>
                                    <Form.Label>2) Textarea</Form.Label>
                                    <Form.Control as="textarea" />
                                </Form.Group>

                                {/* select */}
                                <Form.Group>
                                    <Form.Label>3) Select</Form.Label>
                                    <Form.Control as="select" className="mb-1">
                                        <option value="">기본 셀렉트</option>
                                        <option>옵션1</option>
                                        <option>옵션2</option>
                                    </Form.Control>
                                    <Form.Control as="select" custom className="mb-1">
                                        <option value="">커스텀 셀렉트</option>
                                        <option>옵션1</option>
                                        <option>옵션2</option>
                                    </Form.Control>
                                    <MokaAutocomplete options={options} />
                                </Form.Group>

                                {/* checkbox */}
                                <Form.Group>
                                    <Form.Label>4) Checkbox</Form.Label>
                                    <Form.Check label="default checkbox" type="checkbox" name="checkbox-test" />
                                    <Form.Check label="default checkbox2" type="checkbox" name="checkbox-test" checked={checked} onChange={() => setChecked(!checked)} />
                                    <Form.Check custom id="c-c-t" checked={checked} onChange={() => setChecked(!checked)} label="커스텀(id 필수)" />
                                </Form.Group>

                                {/* radiobutton */}
                                <Form.Group>
                                    <Form.Label>5) Radiobutton</Form.Label>
                                    <Form.Check type="radio" label="default radio" name="radio" />
                                    <Form.Check type="radio" label="default radio2" name="radio" />
                                    <Form.Check custom type="radio" name="radio" id="c-r" label="커스텀(id 필수)" />
                                </Form.Group>

                                {/* Switch */}
                                <Form.Group>
                                    <Form.Label>6) Switch (기본이 custom)</Form.Label>
                                    <FormCheck>
                                        <FormCheck.Label>TEST</FormCheck.Label>
                                        <FormCheck.Input custom type="radio" />
                                    </FormCheck>
                                    <Form.Check type="switch" label="default check" id="custom-switch" />
                                    <Form.Check type="switch" label="default check" id="d-custom-switch" disabled />
                                </Form.Group>

                                {/* File */}
                                <Form.Group>
                                    <Form.Label>7) 파일</Form.Label>
                                    <Form.File id="custom-file" label="Custom file input" custom />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="6">
                    <h1 className="h3 mb-3">Advanced Inputs</h1>
                    <Card>
                        <Card.Header>
                            <Card.Title tag="h5" className="mb-0">
                                Form
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {/* 자동완성 */}
                            <Form.Group>
                                <Form.Label>1) 자동완성(react-select lib 사용)</Form.Label>
                                <MokaAutocomplete
                                    options={options}
                                    closeMenuOnSelect={false}
                                    isMulti
                                    searchIcon={true}
                                    value={multiSelectValue}
                                    onChange={(value, event) => {
                                        setMultiSelectValue(value);
                                    }}
                                />
                            </Form.Group>

                            {/* Input Mask */}
                            <Form.Group>
                                <Form.Label>2) InputMask</Form.Label>
                                <InputMask mask="(999) 9999-9999">{(inputProps) => <Form.Control {...inputProps} />}</InputMask>
                            </Form.Group>

                            {/* 달력 */}
                            <Form.Group>
                                <Form.Label>3) Datetime picker</Form.Label>
                                <MokaDateTimePicker className="mb-3" placeholder="날짜를 선택해주세요" />
                                <MokaDateTimePicker className="mb-3" dateFormat={null} />
                                <MokaDateTimePicker className="mb-3" timeFormat={null} />
                            </Form.Group>

                            {/* Modal */}
                            <div className="mb-3">
                                <Button className="mr-2" onClick={() => setShowD(true)}>
                                    드래그 모달
                                </Button>
                                <MokaDraggableModal show={showD} onHide={() => setShowD(false)} title="드래그가능한 모달">
                                    <div>
                                        <h1>드래그 가능한 모달</h1>
                                        <Button
                                            onClick={() => {
                                                toastr.confirm('적용하시겠습니까?', {
                                                    onOk: () => {
                                                        setShowD(false);
                                                    },
                                                    onCancle: () => {},
                                                    attention: false,
                                                });
                                            }}
                                        >
                                            적용
                                        </Button>
                                    </div>
                                </MokaDraggableModal>

                                {/* toastr test */}
                                <Button
                                    className="mr-2"
                                    onClick={() => {
                                        // toastr.confirm('확인창', {
                                        //     onOk: () => console.log('OK: clicked'),
                                        //     onCancle: () => console.log('CANCLE: clicked')
                                        // });
                                        toastr.success('ddd', 'ddd');
                                    }}
                                >
                                    토스트 테스트
                                </Button>

                                {/* 대중소 모달 */}
                                <Button className="mr-2" onClick={() => setShowLMS(true)}>
                                    대중소 모달
                                </Button>
                                <MokaCodeListModal
                                    show={showLMS}
                                    onHide={() => setShowLMS(false)}
                                    onOk={(codeData) => {
                                        toastr.success('선택한 코드', codeData.codeId);
                                    }}
                                    title="분류 검색"
                                />

                                {/* 테마변경 */}
                                <Button className="mr-2" onClick={() => dispatch(changeTheme('classic'))}>
                                    테마1
                                </Button>
                                {/* <Button
                                    className="mr-2"
                                    onClick={() => dispatch(changeTheme('corporate'))}
                                >
                                    테마2
                                </Button>
                                <Button className="mr-2" onClick={() => dispatch(changeTheme('modern'))}>
                                    테마3
                                </Button> */}
                            </div>

                            <Form.Group>
                                <Form.Label>4) Input Group</Form.Label>
                                <MokaPrependLinkInput
                                    className="mb-3"
                                    to="/404"
                                    linkText="ID : 3"
                                    inputProps={[
                                        {
                                            placeholder: '템플릿위치그룹',
                                            disabled: true,
                                            className: 'bg-white',
                                        },
                                        { placeholder: '템플릿명' },
                                    ]}
                                />
                                <MokaSearchInput variant="warning" onSearch={() => toastr.success('테스트', '성공')} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>5) 파일 드롭존 테스트</Form.Label>
                                <div>
                                    <MokaImageInput />
                                </div>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>+ 다른 드롭존</Form.Label>
                                <div>
                                    <MokaImageInput />
                                </div>
                            </Form.Group>

                            <Form.Group>
                                <MokaAlert variant="primary">
                                    <MokaAlert.Heading>Alert Heading 영역</MokaAlert.Heading>
                                    텍스트 영역
                                    <MokaAlert.Link href="#">링크</MokaAlert.Link>입니다.
                                </MokaAlert>
                                <MokaAlert variant="primary" outline dismissible>
                                    <MokaAlert.Heading>Alert Heading 영역</MokaAlert.Heading>
                                    outline, dismissible 상태
                                    <MokaAlert.Link href="#">링크</MokaAlert.Link>입니다.
                                </MokaAlert>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="h3 mb-3">Table Test</h1>
                    <Card>
                        <Card.Header>
                            <Card.Title tag="h5" className="mb-0">
                                Basic Table
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Button className="mb-3" onClick={() => setFixedTable(!fixedTable)}>
                                fixed 테이블 토글
                            </Button>
                            <Table fixed={fixedTable} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MokaDashboardPage;
