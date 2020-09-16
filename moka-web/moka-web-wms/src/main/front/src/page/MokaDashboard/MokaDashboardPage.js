import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaDateTimePicker, MokaDraggableModal, MokaAutocomplete } from '@component';

const options = [
    { value: 'chocolate', label: 'Chocolate', test: 'test' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'A', label: 'aaaaa' },
    { value: 'b', label: 'aaaaa' },
    { value: 'c', label: 'aaaaa' },
    { value: 'd', label: 'aaaaa' },
    { value: 'e', label: 'aaaaa' },
    { value: 'f', label: 'aaaaa' },
    { value: 'g', label: 'aaaaa' },
    { value: 'h', label: 'aaaaa' },
    { value: 'i', label: 'aaaaa' },
    { value: 'j', label: 'aaaaa' },
    { value: 'k', label: 'aaaaa' }
];

const MokaDashboardPage = () => {
    const [checked, setChecked] = useState(true);
    const [multiSelectValue, setMultiSelectValue] = useState([]);

    // modal test
    const [showD, setShowD] = useState(false);

    return (
        <Container fluid className="p-0">
            <Row>
                <Col lg="6">
                    <h1 className="h3 mb-3">Basic Inputs</h1>
                    <Card>
                        <Card.Header className="mb-0">Form</Card.Header>
                        <Card.Body>
                            <Form>
                                {/* text input */}
                                <Form.Group>
                                    <Form.Label>1) 기본 텍스트 인풋</Form.Label>
                                    <Form.Control placeholder="입력창입니다" />
                                </Form.Group>

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
                                    <Form.Check
                                        label="default checkbox"
                                        type="checkbox"
                                        name="checkbox-test"
                                    />
                                    <Form.Check
                                        label="default checkbox2"
                                        type="checkbox"
                                        name="checkbox-test"
                                        checked={checked}
                                        onChange={() => setChecked(!checked)}
                                    />
                                    <Form.Check
                                        custom
                                        id="c-c-t"
                                        checked={checked}
                                        onChange={() => setChecked(!checked)}
                                        label="커스텀(id 필수)"
                                    />
                                </Form.Group>

                                {/* radiobutton */}
                                <Form.Group>
                                    <Form.Label>5) Radiobutton</Form.Label>
                                    <Form.Check type="radio" label="default radio" name="radio" />
                                    <Form.Check type="radio" label="default radio2" name="radio" />
                                    <Form.Check
                                        custom
                                        type="radio"
                                        name="radio"
                                        id="c-r"
                                        label="커스텀(id 필수)"
                                    />
                                </Form.Group>

                                {/* Switch */}
                                <Form.Group>
                                    <Form.Label>6) Switch (기본이 custom)</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        label="default check"
                                        id="custom-switch"
                                    />
                                    <Form.Check
                                        type="switch"
                                        label="default check"
                                        id="d-custom-switch"
                                        disabled
                                    />
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
                        <Card.Header className="mb-0">Form</Card.Header>
                        <Card.Body>
                            <Form>
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
                                    <InputMask mask="(999) 9999-9999">
                                        {(inputProps) => <Form.Control {...inputProps} />}
                                    </InputMask>
                                </Form.Group>

                                {/* 달력 */}
                                <Form.Group>
                                    <Form.Label>3) Datetime picker</Form.Label>
                                    <MokaDateTimePicker placeholder="날짜를 선택해주세요" />
                                </Form.Group>
                            </Form>

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
                </Col>
            </Row>
        </Container>
    );
};

export default MokaDashboardPage;
