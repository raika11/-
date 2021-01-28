import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Sortable from '@pages/Survey/component/sortable';
import { Form, Col, Button, Figure, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCard, MokaInput, MokaInputLabel, MokaTableDeleteButton } from '@components';
import { BLANK_IMAGE_PATH, IR_URL } from '@/constants';
import produce from 'immer';
import toast, { messageBox } from '@utils/toastUtil';

import { QuizQuestionFirstTypeComponent, QuizQuestionThirdTypeComponent } from '@pages/Survey/Quiz/components';
import PollPhotoComponent from '@pages/Survey/Poll/components/PollPhotoComponent';

import { initialState, SAVE_QUIZZES, GET_QUIZZES, clearQuizinfo, getQuizzes, saveQuizzes, getQuizzesList, quizQuestionItem } from '@store/survey/quiz';

const initQuestionSetup = {
    questionType: 'third',
    questionCount: 1,
};

const QuizEdit = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const selectQuizSeq = useRef(null);
    const [editData, setEditData] = useState(initialState.quizInfo);
    const [selectImageFile, setSelectImageFile] = useState(null);

    // 항목 생성 설정을 담아둘 스테이트.
    const [questionSetup, setQuestionSetup] = useState(initQuestionSetup);
    const [questionItem, setQuestionItem] = useState([]);
    const [questionList, setQuestionList] = useState([]);

    const imgFileRef = useRef(null);

    // 공통 구분값 URL
    const { quizInfo, save_loading, get_loading } = useSelector((store) => ({
        quizInfo: store.quiz.quizInfo,
        save_loading: store.loading[SAVE_QUIZZES],
        get_loading: store.loading[GET_QUIZZES],
    }));

    const handleChangeEditData = ({ target }) => {
        // console.log(1);
        const { name, value, checked } = target;

        if (name === 'loginYn') {
            setEditData({
                ...editData,
                loginYn: checked === true ? 'Y' : 'N',
            });
        } else if (name === 'replyYn') {
            setEditData({
                ...editData,
                replyYn: checked === true ? 'Y' : 'N',
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    // 퀴즈 커버 이미지 등록 버튼.
    const handleChangeFileInput = (inputName, file) => {
        // console.log(2);
        if (file) {
            setEditData({
                ...editData,
                imgFile: file,
            });
        }
    };

    // 항목 데이터 초기화.
    const handleResetInfoData = () => {
        // console.log(3);
        setEditData(initialState.quizInfo);
        setQuestionItem([]);
    };

    // 항목 생성 값 변경 처리.
    const handleChangeQuestionsSetup = (e) => {
        // console.log(4);
        const { name, value } = e.target;
        setQuestionSetup({
            ...questionSetup,
            [name]: value,
        });
    };

    const handleQuestionsResult = useCallback((event) => {
        setQuestionList([...questionList, event.editData]);
    });

    // 항목 생성 버튼 클릭 처리.
    const handleClickNewQuestionsButton = useCallback(() => {
        // console.log(6);
        const { questionType, questionCount } = questionSetup;

        let item = {};

        const nextIndex = questionItem.length + 1;
        if (questionType === 'first') {
            item = {
                id: nextIndex,
                item: (
                    <>
                        <QuizQuestionFirstTypeComponent
                            questionIndex={nextIndex}
                            questionCount={questionCount}
                            dataReturnEvent={handleQuestionsResult}
                            selectEditData={null}
                            getLoading={get_loading}
                        />
                    </>
                ),
            };
        } else if (questionType === 'third') {
            item = {
                id: nextIndex,
                item: (
                    <>
                        <QuizQuestionThirdTypeComponent
                            questionIndex={nextIndex}
                            questionCount={questionCount}
                            dataReturnEvent={handleQuestionsResult}
                            selectEditData={null}
                            getLoading={get_loading}
                        />
                    </>
                ),
            };
        }

        const newList = [...questionItem, item];
        setQuestionItem(newList);
        setEditData({
            ...editData,
            questions: [...editData.questions, []],
        });
    }, [editData, get_loading, handleQuestionsResult, questionItem, questionSetup]);

    // 문항 검색 버튼 클릭 처리.
    const handleClickSearchQuestionsButton = () => {
        // console.log('handleClickSearchQuestionsButton');
    };

    const checkValidation = () => {
        return false;
    };

    // 저장 버튼 클릭 처리.
    const handleClickSaveButton = () => {
        // console.log(editData);
        // return;

        let type;
        let quizSeq;

        if (selectQuizSeq.current === 'add') {
            type = 'SAVE';
            quizSeq = null;
        } else {
            type = 'UPDATE';
            quizSeq = selectQuizSeq.current;
        }

        // selectQuizSeq.current;
        // const mode = !isNaN(selectQuizSeq.current) && selectQuizSeq.current;

        // 벨리데이션 체크.
        if (checkValidation()) {
            return;
        }

        // console.log(editData);

        var formData = new FormData();

        formData.append(`quizSts`, editData.quizSts); // 퀴즈상태.
        formData.append(`quizType`, editData.quizType); // 퀴즈유형
        formData.append(`loginYn`, editData.loginYn); // 로그인여부
        formData.append(`replyYn`, editData.replyYn); // 댓글 여부
        // formData.append(`quizUrl`, editData.quizUrl); // 쥐크 URL
        formData.append(`imgUrl`, editData.imgUrl); // 이미지 URL
        formData.append(`title`, editData.title); // 제목
        formData.append(`quizDesc`, editData.quizDesc); // 퀴즈설명
        if (editData.imgFile) {
            formData.append(`imgFile`, editData.imgFile); // 이미지 파일.
        }

        // questions[0].questionSeq

        // 문항
        let questionCount = 0;
        // let questions = editData.questions;
        // let questions = questionList;

        // console.log(questions);
        questionList.map((element, i) => {
            const { questionType } = element;
            formData.append(`questions[${questionCount}].questionType`, questionType);

            if (questionType === 'S') {
                let choices = element.choices;

                formData.append(`questions[${questionCount}].choiceCnt`, choices.length);
                formData.append(`questions[${questionCount}].imgUrl`, element.imgUrl);
                formData.append(`questions[${questionCount}].title`, element.title);
                formData.append(`questions[${questionCount}].questionDesc`, element.questionDesc);

                if (element.questionSeq) {
                    formData.append(`questions[${questionCount}].questionSeq`, element.questionSeq);
                }

                if (element.imgFile) {
                    formData.append(`questions[${questionCount}].imgFile`, element.imgFile);
                }

                choices.map((e, ii) => {
                    formData.append(`questions[${questionCount}].choices[${ii}].title`, e.title);
                    formData.append(`questions[${questionCount}].choices[${ii}].answYn`, e.answYn);
                });
            } else if (questionType === 'O') {
                formData.append(`questions[${questionCount}].title`, element.title);
                formData.append(`questions[${questionCount}].answer`, element.answer);

                if (element.questionSeq) {
                    formData.append(`questions[${questionCount}].questionSeq`, element.questionSeq);
                }

                if (element.imgFile) {
                    formData.append(`questions[${questionCount}].imgFile`, element.imgFile);
                }
            }

            questionCount++;
        });

        // formData 출력(테스트).
        // for (let [key, value] of formData) {
        //     console.log(`${key}: ${value}`);
        // }
        // return;

        dispatch(
            saveQuizzes({
                type: type,
                quizSeq: quizSeq,
                formData: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { quizSeq } = body;
                        if (quizSeq) {
                            // 등록 및 수정 성공시 store 값 초기화 후 다시 데이터를 가지고 옴.
                            dispatch(clearQuizinfo());
                            dispatch(getQuizzesList());
                            dispatch(getQuizzes({ quizSeq: quizSeq }));
                            history.push(`/quiz/${quizSeq}`);
                        }
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    // url 에서 현재 선택한 게시판 id 값 설정.
    useEffect(() => {
        // console.log(7);
        const { quizSeq } = params;
        if (!isNaN(quizSeq) && selectQuizSeq.current !== quizSeq) {
            selectQuizSeq.current = quizSeq;
            handleResetInfoData();
            dispatch(getQuizzes({ quizSeq: quizSeq }));
        } else if (history.location.pathname === '/quiz/add' && selectQuizSeq.current !== 'add') {
            selectQuizSeq.current = 'add';
            handleResetInfoData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // 스토어에서 quizInfo 가 업데이트 되었을때. ( 목록에서 클릭 하고 url 이 변경 되었을때.)
    useEffect(() => {
        // console.log(8);
        const setInfoData = (data) => {
            setEditData({
                ...editData,
                quizSts: data.quizSts,
                loginYn: data.loginYn,
                replyYn: data.replyYn,
                title: data.title,
                quizDesc: data.quizDesc,
                quizType: data.quizType,
                imgUrl: data.imgUrl,
            });
        };

        const setQuestions = (data) => {
            setQuestionItem(
                data.map((element, index) => {
                    // console.log();
                    let questionType = element.questionType;
                    if (questionType === 'S') {
                        return {
                            id: index,
                            item: (
                                <>
                                    <QuizQuestionThirdTypeComponent
                                        questionIndex={index}
                                        questionCount={element.choiceCnt}
                                        dataReturnEvent={handleQuestionsResult}
                                        selectEditData={element}
                                        getLoading={get_loading}
                                    />
                                </>
                            ),
                        };
                    } else if (questionType === 'O') {
                        return {
                            id: index,
                            item: (
                                <>
                                    <QuizQuestionFirstTypeComponent
                                        questionIndex={index}
                                        questionCount={element.choiceCnt}
                                        dataReturnEvent={handleQuestionsResult}
                                        selectEditData={element}
                                        getLoading={get_loading}
                                    />
                                </>
                            ),
                        };
                    }
                }),
            );
        };

        if (selectQuizSeq.current !== 'add') {
            setInfoData(quizInfo);
            setQuestions(quizInfo.questions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizInfo]);

    useEffect(() => {
        // console.log(10);
        return () => {
            dispatch(clearQuizinfo());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            titleAs={
                <div className="w-100 d-flex">
                    <p className="m-0 h5 font-weight-bold">투표 등록</p>
                    <p className="m-0 pl-2 ft-12 text-positive">* 필수 입력항목</p>
                </div>
            }
            className="flex-fill"
            footer
            loading={save_loading}
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '미리보기', variant: 'positive', onClick: () => console.log('미리보기'), className: 'mr-05' },
                { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: () => history.push('/quiz'), className: 'mr-05' },
            ]}
            width={750}
        >
            <Form>
                <Form.Row className="mb-2 p-2">
                    <Col xs={9}>
                        <Form.Row className="mb-2">
                            <Col xs={6}>
                                <MokaInputLabel
                                    label="서비스 상태"
                                    as="select"
                                    labelWidth={66}
                                    onChange={(e) => handleChangeEditData(e)}
                                    id="quizSts"
                                    name="quizSts"
                                    value={editData.quizSts}
                                >
                                    <option value="P">일시중지</option>
                                    <option value="Y">서비스중</option>
                                    <option value="N">서비스 종료</option>
                                </MokaInputLabel>
                            </Col>
                            <Col xs={3} className="pr-0">
                                <MokaInputLabel
                                    as="switch"
                                    label="로그인"
                                    labelClassName="text-right ml-0"
                                    id="loginYn"
                                    name="loginYn"
                                    inputProps={{ checked: editData.loginYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                            <Col xs={3} className="pl-0 pr-0">
                                <MokaInputLabel
                                    as="switch"
                                    label="댓글"
                                    labelClassName="text-right"
                                    id="replyYn"
                                    name="replyYn"
                                    inputProps={{ checked: editData.replyYn === 'Y' ? true : false }}
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    label="퀴즈 제목"
                                    labelWidth={66}
                                    required={true}
                                    value={editData.title}
                                    onChange={(e) => handleChangeEditData(e)}
                                    id="title"
                                    name="title"
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    as="textarea"
                                    className="mb-2"
                                    label="퀴즈 설명"
                                    labelWidth={66}
                                    inputClassName="resize-none"
                                    inputProps={{ rows: 3 }}
                                    id="quizDesc"
                                    name="quizDesc"
                                    value={editData.quizDesc}
                                    onChange={(e) => handleChangeEditData(e)}
                                />
                            </Col>
                        </Form.Row>
                        {/* <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    label="url"
                                    labelWidth={66}
                                    required={true}
                                    value={editData.quizUrl}
                                    onChange={(e) => handleChangeEditData(e)}
                                    id="quizUrl"
                                    name="quizUrl"
                                />
                            </Col>
                        </Form.Row> */}
                        <Form.Row className="mb-2">
                            <Col xs={12}>
                                <MokaInputLabel
                                    as="select"
                                    label="결과 유형"
                                    labelWidth={66}
                                    required={true}
                                    onChange={(e) => handleChangeEditData(e)}
                                    id="quizType"
                                    name="quizType"
                                    value={editData.quizType}
                                >
                                    <option value="AA">전체노출전체정답</option>
                                    <option value="AS">전체노출퀴즈별정답</option>
                                    <option value="SA">1건노출전체정답</option>
                                    <option value="SS">1건노출퀴즈별정답</option>
                                </MokaInputLabel>
                            </Col>
                        </Form.Row>
                    </Col>
                    <Col xs={3}>
                        <Form.Row>
                            <Col xs={12} className="d-flex align-items-center">
                                <Form.Label className="px-0 mb-0 position-relative flex-shrink-0">퀴즈 커버 이미지</Form.Label>
                            </Col>
                        </Form.Row>
                        <Form.Row style={{ height: '55%' }} className="mb-2">
                            <Col xs={12}>
                                {/* <Figure.Image src={IR_URL + BLANK_IMAGE_PATH} className="mb-0 w-100 h-100" /> */}
                                {/* <QuizPhotoBoxComponent /> */}
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
                    </Col>
                </Form.Row>

                <Form.Row className="mb-2 p-2 bg-gray150">
                    <Form.Row className="w-100 justify-content-between">
                        <Col xs={7}>
                            <Form.Row>
                                <Col xs={6}>
                                    <MokaInputLabel
                                        as="select"
                                        labelWidth={66}
                                        label="문항 유형"
                                        onChange={(e) => handleChangeQuestionsSetup(e)}
                                        id="questionType"
                                        name="questionType"
                                        value={questionSetup.questionType}
                                    >
                                        <option value="third">객관식</option>
                                        <option value="first">주관식</option>
                                    </MokaInputLabel>
                                </Col>
                                <Col xs={6}>
                                    <MokaInputLabel
                                        type="number"
                                        label="보기 입력 개수"
                                        labelWidth={85}
                                        onChange={(e) => handleChangeQuestionsSetup(e)}
                                        id="questionCount"
                                        name="questionCount"
                                        value={questionSetup.questionCount}
                                        disabled={questionSetup.questionType === 'first' ? true : false}
                                    />
                                </Col>
                            </Form.Row>
                        </Col>
                        <Col xs={3}>
                            <Form.Row>
                                <Col xs={4}>
                                    <Button variant="positive" onClick={() => handleClickNewQuestionsButton()}>
                                        생성
                                    </Button>
                                </Col>
                                <Col xs={8} className="ml-2">
                                    <Button variant="searching" onClick={() => handleClickSearchQuestionsButton()}>
                                        문항 검색
                                    </Button>
                                </Col>
                            </Form.Row>
                        </Col>
                    </Form.Row>
                </Form.Row>

                {/* 문항 */}
                {get_loading !== true && <Sortable items={questionItem} editData={editData} />}
            </Form>
        </MokaCard>
    );
};

export default QuizEdit;
