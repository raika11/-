import React, { useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInputLabel, AgGripIcon } from '@components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import { useSelector, useDispatch } from 'react-redux';
import { questionInfoChange, deleteQuestion } from '@store/survey/quiz';
import { DeleteConfirmModal } from '@pages/Survey/Quiz/modals';

// 주관식 컴포넌트
const QuizQuestionFirstTypeComponent = ({ questionIndex, quizSts }) => {
    const dispatch = useDispatch();
    const [deleteConfirmModalState, setDeleteConfirmModalState] = useState(false);
    const { questionsList } = useSelector((store) => ({
        questionsList: store.quiz.quizQuestions.questionsList,
    }));

    // 삭제 버튼
    const handleClickQuestionDeleteButton = () => {
        if (quizSts === 'Y') {
            setDeleteConfirmModalState(true);
        } else {
            dispatch(deleteQuestion({ questionIndex: questionIndex }));
        }
    };

    // alert 창에서 확인 눌렀을 경우.
    const handleAlertDelete = () => {
        dispatch(deleteQuestion({ questionIndex: questionIndex }));
        setDeleteConfirmModalState(false);
    };

    // 퀴즈 정보 업데이트 처리.
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

    // 이미지 처리.
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
            <div className="mb-2 p-2 bg-gray-150">
                <Form.Row>
                    <Col xs={1}>
                        <AgGripIcon />
                    </Col>
                    {/* 질문 */}
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
                        <div onClick={() => handleClickQuestionDeleteButton()}>
                            <AgGripIcon />
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="pt-3">
                    <Col xs={9}>
                        <Form.Row className="pt-1">
                            <Col xs={12}>
                                {/* 정답 */}
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
                            {/* 정답 */}
                            <Col xs={12}>
                                <MokaInputLabel as="none" label="정답으로 처리할 수 있는 단어는 (,)로 구분하여 다수 등록 가능 " required labelClassName="w-100 ml-0" />
                            </Col>
                        </Form.Row>
                        <Form.Row className="pt-2">
                            {/* 설명 */}
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
                    <Col xs={3}>
                        {/* 이미지 */}
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
                <DeleteConfirmModal
                    show={deleteConfirmModalState}
                    onHide={(e) => {
                        if (e.type === 'save') {
                            handleAlertDelete();
                        }
                        setDeleteConfirmModalState(false);
                    }}
                />
            </div>
        </>
    );
};

export default QuizQuestionFirstTypeComponent;
