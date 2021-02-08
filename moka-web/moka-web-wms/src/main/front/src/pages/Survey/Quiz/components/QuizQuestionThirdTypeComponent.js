import React, { useState, useCallback, forwardRef, useRef } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { MokaInputLabel, MokaTableDeleteButton, AgGripIcon, MokaOverlayTooltipButton, MokaIcon } from '@components';
import { useSelector, useDispatch } from 'react-redux';
import { questionInfoChange, deleteAllQuestion, addQuestionChoices } from '@store/survey/quiz';
import { DeleteConfirmModal } from '@pages/Survey/Quiz/modals';
import { messageBox } from '@utils/toastUtil';
import Dropdown from 'react-bootstrap/Dropdown';

// 객관식 컴포넌트
const QuizQuestionThirdTypeComponent = ({ questionIndex, quizSts }) => {
    const dispatch = useDispatch();
    const [deleteConfirmModalState, setDeleteConfirmModalState] = useState(false);

    const imgFileRef = useRef(null);

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
                                            className="ml-2 pl-4"
                                            inputProps={{ label: '', custom: true, checked: element.answYn === 'Y' }}
                                            onChange={(e) => handleChangeEditData(e, index)}
                                        />
                                    </Col>
                                    <Col xs={10}>
                                        <MokaInputLabel
                                            label={`보기 ${index + 1}`}
                                            labelWidth={35}
                                            placeholder="(20자 이내로 입력하세요)"
                                            labelClassName="mr-2 pr-1"
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
                        <MokaInputLabel
                            as="imageFile"
                            className="mb-2"
                            name="selectImg"
                            ref={imgFileRef}
                            inputProps={{
                                width: 150,
                                height: 150,
                                img: questionsList[questionIndex].imgUrl,
                            }}
                            labelClassName="justify-content-end"
                            onChange={(file) => {
                                dispatch(
                                    questionInfoChange({
                                        ...questionsList[questionIndex],
                                        questionIndex: questionIndex,
                                        imgFile: file[0],
                                    }),
                                );
                            }}
                        />
                        <Col className="d-flex justify-content-start pl-0">
                            <Button
                                className="mt-0"
                                size="sm"
                                variant="positive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    imgFileRef.current.deleteFile();
                                    questionInfoChange({
                                        ...questionsList[questionIndex],
                                        questionIndex: questionIndex,
                                        imgFile: null,
                                    });
                                }}
                            >
                                신규등록
                            </Button>
                        </Col>
                    </Col>
                </Form.Row>
                {/* 정답. */}
                <Form.Row className="pl-4 pt-0">
                    <Col xs={12}>
                        <MokaInputLabel as="none" label="정답을 체크해 주세요." required labelClassName="w-100 ml-0" />
                    </Col>
                </Form.Row>
                {/* 설명 */}
                <Form.Row className="pt-0">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 3 }}
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
