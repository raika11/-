import React, { useState, useCallback, forwardRef } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaInputLabel, MokaTableDeleteButton, AgGripIcon, MokaOverlayTooltipButton, MokaIcon } from '@components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';
import { useSelector, useDispatch } from 'react-redux';
import { questionInfoChange, deleteQuestion, deleteAllQuestion, addQuestionChoices } from '@store/survey/quiz';
import { DeleteConfirmModal } from '@pages/Survey/Quiz/modals';
import { messageBox } from '@utils/toastUtil';
import Dropdown from 'react-bootstrap/Dropdown';
import produce from 'immer';

// 객관식 컴포넌트
const QuizQuestionThirdTypeComponent = ({ questionIndex, quizSts }) => {
    const dispatch = useDispatch();
    const [deleteConfirmModalState, setDeleteConfirmModalState] = useState(false);
    // 스토어 연결.
    const { questionsList } = useSelector((store) => ({
        questionsList: store.quiz.quizQuestions.questionsList,
    }));

    // 퀴즈 삭제 버튼 처리.
    // const handleClickQuestionDeleteButton = () => {
    //     if (quizSts === 'Y') {
    //         setDeleteConfirmModalState(true);
    //     } else {
    //         dispatch(deleteQuestion({ questionIndex: questionIndex }));
    //     }
    // };

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

    // alert 창에서 확인 눌렀을 경우.
    const handleAlertDelete = () => {
        // dispatch(deleteQuestion({ questionIndex: questionIndex }));
        dispatch(deleteAllQuestion());
        setDeleteConfirmModalState(false);
    };

    // 보기 삭제 버튼 처리.
    const handleClickDeleteButton = (choices_index) => {
        let tempData = questionsList[questionIndex];
        if (tempData.choices.length === 1) {
            messageBox.alert('보기는 1개 이상이어야 합니다.', () => {});
            return;
        }
        dispatch(
            questionInfoChange({
                ...tempData,
                questionIndex: questionIndex,
                choices: questionsList[questionIndex].choices.filter((e, index) => index !== Number(choices_index)),
            }),
        );
    };

    // 퀴즈 정보 업데이트 처리.
    const handleChangeEditData = (e, index = 'exits') => {
        let tempData = questionsList[questionIndex];
        let tempChoices = [];

        const { name, value, checked } = e.target;

        if (index !== 'exits') {
            if (name === 'answYn') {
                tempChoices = tempData.choices.map((e, i) => {
                    if (i === index) {
                        return {
                            answYn: checked === false ? 'N' : 'Y',
                            title: e.title,
                        };
                    } else {
                        return {
                            answYn: 'N',
                            title: e.title,
                        };
                    }
                });
            }

            if (name === 'title') {
                tempChoices = tempData.choices.map((e, i) => {
                    if (i === index) {
                        return {
                            answYn: e.answYn,
                            title: value,
                        };
                    } else {
                        return e;
                    }
                });
            }

            dispatch(
                questionInfoChange({
                    ...tempData,
                    questionIndex: questionIndex,
                    choices: tempChoices,
                }),
            );
        } else {
            dispatch(
                questionInfoChange({
                    ...tempData,
                    questionIndex: questionIndex,
                    [name]: value,
                }),
            );
        }
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

    return (
        <>
            <div className="mb-2 p-2 bg-gray-150">
                {/* 질문. */}
                <Form.Row>
                    <Col xs={1}>
                        <AgGripIcon />
                    </Col>
                    <Col xs={10}>
                        <MokaInputLabel
                            label={`Q${Number(questionIndex) + 1}.`}
                            labelWidth={20}
                            placeholder="질문을 입력하세요.(100자 이내로 입력하세요)"
                            labelClassName="mr-1"
                            inputClassName="quiz-input"
                            id={`title_${questionIndex}`}
                            name="title"
                            value={questionsList[questionIndex].title}
                            onChange={(e) => handleChangeEditData(e)}
                        />
                    </Col>
                    <Col xs={1}>
                        <MokaOverlayTooltipButton tooltipText="더보기" variant="white" className="p-0">
                            <Dropdown style={{ position: 'unset' }}>
                                <Dropdown.Toggle as={DropdownToggle} id="dropdown-desking-edit" />
                                <Dropdown.Menu>{createDropdownItem()}</Dropdown.Menu>
                            </Dropdown>
                        </MokaOverlayTooltipButton>
                    </Col>
                </Form.Row>
                {/* 보기. */}
                <Form.Row className="pt-3">
                    <Col xs={9}>
                        {questionsList[questionIndex].choices.map((element, index) => {
                            return (
                                <Form.Row className="pt-1" key={index}>
                                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                                        <MokaInputLabel
                                            name={`answYn`}
                                            id={`answYn_${index}_${questionIndex}`}
                                            as="checkbox"
                                            className="ml-2"
                                            inputProps={{ label: '', custom: true, checked: element.answYn === 'Y' }}
                                            onChange={(e) => handleChangeEditData(e, index)}
                                        />
                                    </Col>
                                    <Col xs={10}>
                                        <MokaInputLabel
                                            label={`보기 ${index + 1}`}
                                            labelWidth={35}
                                            placeholder="(20자 이내로 입력하세요)"
                                            labelClassName="mr-2"
                                            inputClassName="quiz-input"
                                            name={`title`}
                                            id={`title_${index}_${questionIndex}`}
                                            value={element.title}
                                            onChange={(e) => handleChangeEditData(e, index)}
                                        />
                                    </Col>
                                    <Col className="d-felx align-self-center text-left mb-0 pl-0">
                                        <MokaTableDeleteButton onClick={() => handleClickDeleteButton(index)} />
                                    </Col>
                                </Form.Row>
                            );
                        })}
                    </Col>
                    {/* 이미지 */}
                    <Col xs={3}>
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
                {/* 정답. */}
                <Form.Row className="pl-3 pt-2">
                    <Col xs={12}>
                        <MokaInputLabel as="none" label="정답을 체크해 주세요." required labelWidth={100} labelClassName="text-right ml-0" />
                    </Col>
                </Form.Row>
                {/* 설명 */}
                <Form.Row className="pt-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 2 }}
                            id="questionDesc"
                            name="questionDesc"
                            value={questionsList[questionIndex].questionDesc}
                            placeholder="정답 설명을 입력(90자 이내로 입력하세요)"
                            onChange={(e) => handleChangeEditData(e)}
                        />
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

export default QuizQuestionThirdTypeComponent;
