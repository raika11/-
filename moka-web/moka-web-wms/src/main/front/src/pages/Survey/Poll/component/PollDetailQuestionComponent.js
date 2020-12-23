import React, { useState } from 'react';
import { Form, Col, Figure } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import { BLANK_IMAGE_PATH, IR_URL } from '@/constants';
import Button from 'react-bootstrap/Button';

const PollDetailQuestionComponent = ({ label1, label2, type, onChange }) => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    return (
        <Form.Row>
            {type !== 'P' && (
                <Col className="flex-fill">
                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel
                                label={label1}
                                labelWidth={35}
                                onChange={(e) => {
                                    setValue1(e.target.value);
                                }}
                                value={value1}
                                placeholder="보기를 입력해주세요."
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col xs={12}>
                            <MokaInputLabel
                                label={label2}
                                labelWidth={35}
                                onChange={(e) => {
                                    setValue2(e.target.value);
                                }}
                                value={value2}
                                placeholder="url을 입력해주세요"
                            />
                        </Col>
                    </Form.Row>
                </Col>
            )}

            {type !== 'M' && (
                <Col xs={2}>
                    <Form.Row>
                        <Col xs={12} className="mb-2 text-center">
                            <Figure.Image className="mb-0" src={IR_URL + BLANK_IMAGE_PATH} style={{ height: '70px', width: '100%' }} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="d-flex justify-content-center">
                        <Col xs={7} className="pr-0">
                            <Button variant="outline-table-btn" size="sm">
                                신규등록
                            </Button>
                        </Col>
                        <Col xs={5}>
                            <Button variant="outline-table-btn" size="sm">
                                편집
                            </Button>
                        </Col>
                    </Form.Row>
                </Col>
            )}
        </Form.Row>
    );
};

export default PollDetailQuestionComponent;
