import React, { useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInputLabel } from '@components';

const QuizMultipleChoiceAnswerComponent = ({ questionNumber, answerNumber }) => {
    const [title, setTitle] = useState('');
    return (
        <Form.Row className="justify-content-between pr-2 pl-2 mb-1">
            <Col xs={11}>
                <MokaInputLabel
                    label={`보기 ${answerNumber}.`}
                    labelWidth={60}
                    className="text-right"
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
                <Form.Check label="" type="checkbox" name="answer" id={`answer-${questionNumber}-${answerNumber}`} className="ml-2" custom />
            </Col>
        </Form.Row>
    );
};

export default QuizMultipleChoiceAnswerComponent;
