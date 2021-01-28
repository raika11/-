import React, { useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInputLabel } from '@components';

const QuizQuestionComponent = ({ questionNumber }) => {
    const [title, setTitle] = useState('');
    return (
        <>
            <Form.Row className="justify-content-between pr-2 pl-2 mb-2">
                <Col xs={11}>
                    <MokaInputLabel
                        label={`Q${questionNumber}.`}
                        labelWidth={30}
                        placeholder="질문을 입력하세요.(100자 이내로 입력하세요)"
                        labelClassName="mr-1"
                        inputClassName="quiz-input"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </Col>
                <Col xs={1} className="d-flex align-items-center justify-content-center">
                    정답
                </Col>
            </Form.Row>
        </>
    );
};

export default QuizQuestionComponent;
