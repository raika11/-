import React, { useState, useRef, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';

const QuizQuestionFirstTypeComponent = ({ questionIndex, questionCount, dataReturnEvent }) => {
    const [editData, setEditData] = useState({
        questionIndex: questionIndex,
        questionType: 'O',
        imgFile: {},
        title: '',
        questionDesc: '',
        answer: '',
    });

    const handleChangeEditData = (e) => {
        const { name, value } = e.target;

        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleChangeFileInput = (inputName, file) => {
        setEditData({
            ...editData,
            imgFile: file,
        });

        return inputName;
    };

    useEffect(() => {
        dataReturnEvent({
            questionIndex: questionIndex,
            questionCount: questionCount,
            editData: editData,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData]);

    useEffect(() => {
        console.log('First type');
        console.log(questionCount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="mb-2 p-2 bg-gray150">
                <Form.Row>
                    <Col xs={1}>
                        <div>||</div>
                    </Col>
                    <Col xs={10}>
                        <MokaInputLabel
                            label={`Q${questionIndex}.`}
                            id={`title_${questionIndex}`}
                            name="title"
                            labelWidth={20}
                            placeholder="질문을 입력하세요.(100자 이내로 입력하세요)"
                            labelClassName="mr-1"
                            inputClassName="quiz-input"
                            value={editData.title}
                            onChange={(e) => handleChangeEditData(e)}
                        />
                    </Col>
                    <Col xs={1}>
                        <div>|</div>
                    </Col>
                </Form.Row>
                <Form.Row className="pt-3">
                    <Col xs={10}>
                        <Form.Row className="pt-1">
                            <Col xs={12}>
                                <MokaInputLabel
                                    label={`정답`}
                                    labelWidth={60}
                                    // className="text-right"
                                    placeholder="(단어로 띄어쓰기 1개 까지 가능)"
                                    labelClassName="mr-0"
                                    inputClassName="quiz-input"
                                    id={`answer_${questionIndex}`}
                                    name="answer"
                                    value={editData.answer}
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="pl-3 pt-2">
                            <Col xs={12}>
                                <MokaInputLabel as="none" label="정답으로 처리할 수 있는 단어는 (,)로 구분하여 다수 등록 가능 " required labelClassName="w-100 ml-0" />
                            </Col>
                        </Form.Row>
                        <Form.Row className="pt-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    as="textarea"
                                    className="mb-2"
                                    inputClassName="resize-none"
                                    inputProps={{ rows: 2 }}
                                    id={`questionDesc_${questionIndex}`}
                                    name="questionDesc"
                                    value={editData.questionDesc}
                                    placeholder="정답 설명을 입력(90자 이내로 입력하세요)"
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                        </Form.Row>
                    </Col>
                    <Col xs={2}>
                        <PollPhotoComponent
                            width={110}
                            height={110}
                            src={editData.imgUrl}
                            onChange={(file) => {
                                handleChangeFileInput('imgFile', file, 'file');
                            }}
                        >
                            150 x 150
                        </PollPhotoComponent>
                    </Col>
                </Form.Row>
            </div>
        </>
    );
};

export default QuizQuestionFirstTypeComponent;
