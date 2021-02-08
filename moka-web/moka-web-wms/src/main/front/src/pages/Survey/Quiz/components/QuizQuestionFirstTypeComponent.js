import React, { useState, useRef, useCallback, forwardRef } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { MokaInputLabel, AgGripIcon, MokaOverlayTooltipButton, MokaIcon } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { questionInfoChange, deleteQuestion, addQuestionChoices, deleteAllQuestion } from '@store/survey/quiz';
import { DeleteConfirmModal } from '@pages/Survey/Quiz/modals';
import Dropdown from 'react-bootstrap/Dropdown';

// 주관식 컴포넌트
const QuizQuestionFirstTypeComponent = ({ questionIndex, quizSts }) => {
    const dispatch = useDispatch();
    const [deleteConfirmModalState, setDeleteConfirmModalState] = useState(false);
    const imgFileRef = useRef(null);
    const { questionsList } = useSelector((store) => ({
        questionsList: store.quiz.quizQuestions.questionsList,
    }));

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

    // 전체 삭제.
    const handleClickAllDeleteButton = useCallback(() => {
        if (quizSts === 'Y') {
            setDeleteConfirmModalState(true);
        } else {
            dispatch(deleteAllQuestion());
        }
    }, [dispatch, quizSts]);

    // 보기 추가 버튼.
    const handleClickQuestionAddButton = useCallback(() => {
        dispatch(
            addQuestionChoices({
                index: questionIndex,
                choice: {
                    answYn: 'N',
                    title: '',
                },
            }),
        );
    }, [dispatch, questionIndex]);

    const createDropdownItem = useCallback(() => {
        const items = [
            { text: '전체삭제', onClick: () => handleClickAllDeleteButton() },
            { text: '보기 추가', onClick: () => handleClickQuestionAddButton() },
        ];

        return (
            <>
                {items.map((i, idx) => (
                    <Dropdown.Item key={idx} eventKey={idx} onClick={i.onClick}>
                        {i.text}
                    </Dropdown.Item>
                ))}
            </>
        );
    }, [handleClickAllDeleteButton, handleClickQuestionAddButton]);

    const DropdownToggle = forwardRef(({ onClick, id }, ref) => {
        return (
            <div ref={ref} className="px-2" onClick={onClick} id={id}>
                <MokaIcon iconName="fal-ellipsis-v-alt" />
            </div>
        );
    });

    const setImageFileValue = (file) => {
        if (!file) {
            questionInfoChange({
                ...questionsList[questionIndex],
                questionIndex: questionIndex,
                imgFile: null,
            });
            return;
        }

        dispatch(
            questionInfoChange({
                ...questionsList[questionIndex],
                questionIndex: questionIndex,
                imgFile: file,
            }),
        );
    };

    return (
        <>
            <div className="mb-2 p-2 bg-gray-150">
                <Form.Row>
                    <div className="d-felx m-0 pr-2">
                        <AgGripIcon className="pt-2" />
                    </div>
                    <Col xs={11}>
                        <MokaInputLabel
                            label={
                                <>
                                    <div>
                                        <div style={{ float: 'left', marginRight: '4px' }}>Q</div>
                                        <div>{`${Number(questionIndex) + 1}`}</div>
                                    </div>
                                </>
                            }
                            labelWidth={40}
                            labelClassName="mr-1"
                            inputClassName="quiz-input"
                            id={`title_${questionIndex}`}
                            name="title"
                            placeholder="질문을 입력하세요.(100자 이내로 입력하세요)"
                            value={questionsList[questionIndex].title}
                            onChange={(e) => handleChangeEditData(e)}
                        />
                    </Col>
                    <div className="d-felx pt-1">
                        <MokaOverlayTooltipButton tooltipText="더보기" variant="bg-gray-150" className="p-0 bg-gray-150">
                            <Dropdown style={{ position: 'unset' }}>
                                <Dropdown.Toggle as={DropdownToggle} id="dropdown-desking-edit" />
                                <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
                            </Dropdown>
                        </MokaOverlayTooltipButton>
                    </div>
                </Form.Row>
                <Form.Row className="pt-3">
                    <Col xs={9}>
                        <Form.Row className="pt-1">
                            <Col xs={12} className="d-felx m-0 pr-2 pl-4">
                                {/* 정답 */}
                                <MokaInputLabel
                                    label={`정답`}
                                    labelWidth={43}
                                    placeholder="(단어로 띄어쓰기 1개 까지 가능)"
                                    labelClassName="mr-0 pr-0 mb-0"
                                    inputClassName="quiz-input"
                                    id={`answer_${questionIndex}`}
                                    name="answer"
                                    value={questionsList[questionIndex].answer}
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="pl-4 pt-5 mb-0">
                            <Col xs={12}>
                                <MokaInputLabel as="none" label="정답으로 처리할 수 있는 단어는 (,)로 구분하여 다수 등록 가능 " required labelClassName="text-left ml-0 w-100" />
                            </Col>
                        </Form.Row>
                        <Form.Row className="pt-2">
                            {/* 설명 */}
                            <Col xs={12}>
                                <MokaInputLabel
                                    as="textarea"
                                    className="mb-1"
                                    inputClassName="resize-none"
                                    inputProps={{ rows: 3 }}
                                    id={`questionDesc_${questionIndex}`}
                                    name="questionDesc"
                                    value={questionsList[questionIndex].questionDesc}
                                    placeholder="정답 설명을 입력(90자 이내로 입력하세요)"
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                        </Form.Row>
                    </Col>
                    <Col xs={3} className="pt-1">
                        {/* 이미지 */}
                        <MokaInputLabel
                            as="imageFile"
                            ref={imgFileRef}
                            labelWidth={90}
                            inputProps={{ img: questionsList[questionIndex].imgUrl, width: 150, height: 150, setFileValue: setImageFileValue, deleteButton: true }}
                        />
                        <Col className="d-flex justify-content-start pl-0 pt-2">
                            <Button
                                className="mt-0"
                                size="sm"
                                variant="positive"
                                onClick={(e) => {
                                    imgFileRef.current.rootRef.onClick(e);
                                }}
                            >
                                신규등록
                            </Button>
                        </Col>
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
