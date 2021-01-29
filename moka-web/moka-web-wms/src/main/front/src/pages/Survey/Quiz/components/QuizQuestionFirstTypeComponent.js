import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInputLabel } from '@components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import { useSelector, useDispatch } from 'react-redux';
import { questionInfoChange, deleteQuestion } from '@store/survey/quiz';

const QuizQuestionFirstTypeComponent = ({ questionIndex }) => {
    const dispatch = useDispatch();
    const { questionsList } = useSelector((store) => ({
        questionsList: store.quiz.quizQuestions.questionsList,
    }));

    const handleClickQuestionDeleteButton = () => {
        dispatch(deleteQuestion({ questionIndex: questionIndex }));
    };

    const handleChangeEditData = (e) => {
        let tempData = questionsList[questionIndex];
        const { name, value } = e.target;

        dispatch(
            questionInfoChange({
                ...tempData,
                questionIndex: questionIndex,
                [name]: value,
            }),
        );
    };

    const handleChangeFileInput = (inputName, file) => {
        dispatch(
            questionInfoChange({
                ...questionsList[questionIndex],
                questionIndex: questionIndex,
                imgFile: file,
            }),
        );

        return inputName;
    };

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
                            value={questionsList[questionIndex].title}
                            onChange={(e) => handleChangeEditData(e)}
                        />
                    </Col>
                    <Col xs={1}>
                        <div onClick={() => handleClickQuestionDeleteButton()}>|</div>
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
                                    value={questionsList[questionIndex].answer}
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
                                    value={questionsList[questionIndex].questionDesc}
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
                            src={questionsList[questionIndex].imgUrl}
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