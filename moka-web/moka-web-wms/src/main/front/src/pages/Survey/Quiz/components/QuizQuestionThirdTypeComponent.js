import React, { useState, useRef, useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';
import { MokaCard, MokaInput, MokaInputLabel, MokaTableDeleteButton } from '@components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';

const QuizQuestionThirdTypeComponent = ({ questionIndex, questionCount, dataReturnEvent, selectEditData, getLoading }) => {
    const [editData, setEditData] = useState({
        questionIndex: questionIndex,
        questionType: 'S',
        imgUrl: '',
        imgFile: null,
        title: '',
        questionDesc: '',
        questionSeq: '',
        choices: [],
    });

    const handleClickDeleteBUtton = () => {};

    const handleChangeEditData = (e, index = 'exits') => {
        let tempData = editData;

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

            setEditData({
                ...editData,
                choices: tempChoices,
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    const handleChangeFileInput = (inputName, file) => {
        setEditData({
            ...editData,
            imgFile: file,
        });
        return inputName;
    };

    useEffect(() => {
        // console.log(editData);
    }, [editData]);
    useEffect(() => {
        // console.log(getLoading);
    }, [getLoading]);

    useEffect(() => {
        dataReturnEvent({
            questionIndex: questionIndex,
            questionCount: questionCount,
            editData: editData,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData]);

    useEffect(() => {
        const setQuestionList = () => {
            const tempArray = new Array(Number(questionCount)).fill({
                answYn: 'N',
                title: '',
            });
            setEditData({
                ...editData,
                choices: tempArray,
            });
        };

        const setselectEditData = (data) => {
            let choices = data.choices.map((element, i) => {
                return {
                    title: element.title,
                    answYn: element.answYn,
                };
            });
            setEditData({
                ...editData,
                title: data.title,
                choices: choices,
                imgUrl: data.imgUrl,
                questionDesc: data.questionDesc,
                questionSeq: data.questionSeq,
            });
        };
        if (selectEditData !== null) {
            setselectEditData(selectEditData);
        } else {
            setQuestionList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="mb-2 p-2 bg-gray150">
                <Form.Row>
                    <Col xs={1}>||</Col>
                    <Col xs={10}>
                        <MokaInputLabel
                            label={`Q${questionIndex}.`}
                            labelWidth={20}
                            placeholder="질문을 입력하세요.(100자 이내로 입력하세요)"
                            labelClassName="mr-1"
                            inputClassName="quiz-input"
                            id={`title_${questionIndex}`}
                            name="title"
                            value={editData.title}
                            onChange={(e) => handleChangeEditData(e)}
                        />
                    </Col>
                    <Col xs={1}>|</Col>
                </Form.Row>
                <Form.Row className="pt-3">
                    <Col xs={10}>
                        {editData.choices.map((element, index) => {
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
                                        <MokaTableDeleteButton onClick={() => handleClickDeleteBUtton()} />
                                    </Col>
                                </Form.Row>
                            );
                        })}
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
                <Form.Row className="pl-3 pt-2">
                    <Col xs={12}>
                        <MokaInputLabel as="none" label="정답을 체크해 주세요." required labelWidth={100} labelClassName="text-right ml-0" />
                    </Col>
                </Form.Row>
                <Form.Row className="pt-2">
                    <Col xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 2 }}
                            id="questionDesc"
                            name="questionDesc"
                            value={editData.questionDesc}
                            placeholder="정답 설명을 입력(90자 이내로 입력하세요)"
                            onChange={(e) => handleChangeEditData(e)}
                        />
                    </Col>
                </Form.Row>
            </div>
        </>
    );
};

export default QuizQuestionThirdTypeComponent;
