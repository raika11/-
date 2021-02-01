import React, { useState, useEffect, useRef } from 'react';
import { MokaCard, MokaInput, MokaIcon } from '@components';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';
import toast, { messageBox } from '@utils/toastUtil';
import SortAgGrid from '@pages/Survey/component/SortAgGrid';
import { QuizSearchModal } from '@pages/Survey/Quiz/modals';
import { selectQuizChange, clearQuizinfo, getQuizzes, saveQuizzes, getQuizzesList } from '@store/survey/quiz';

const QuizChildRelationInfo = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams();
    const selectQuizSeq = useRef(null);
    const { selectQuiz, quizInfo, questionsList } = useSelector((store) => ({
        selectQuiz: store.quiz.selectQuiz,
        quizInfo: store.quiz.quizInfo,
        questionsList: store.quiz.quizQuestions.questionsList,
    }));

    const [quizSearchModalState, setQuizSearchModalState] = useState(false);

    const handleClickArticleModalShow = () => {};
    const handleClickRelationArticleAdd = () => {};
    const handleClickSelectQuizListDeleteButton = (itemIndex) => {
        dispatch(selectQuizChange(selectQuiz.filter((e, i) => i !== itemIndex)));
    };

    const handleClickQuizSearchButton = () => {
        setQuizSearchModalState(true);
    };

    const checkValidation = () => {
        return false;
    };

    const handleClickSaveButton = () => {
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

        var formData = new FormData();

        formData.append(`quizSts`, quizInfo.quizSts); // 퀴즈상태.
        formData.append(`quizType`, quizInfo.quizType); // 퀴즈유형
        formData.append(`loginYn`, quizInfo.loginYn); // 로그인여부
        formData.append(`replyYn`, quizInfo.replyYn); // 댓글 여부
        // formData.append(`quizUrl`, quizInfo.quizUrl); // 쥐크 URL
        formData.append(`imgUrl`, quizInfo.imgUrl); // 이미지 URL
        formData.append(`title`, quizInfo.title); // 제목
        formData.append(`quizDesc`, quizInfo.quizDesc); // 퀴즈설명
        if (quizInfo.imgFile) {
            formData.append(`imgFile`, quizInfo.imgFile); // 이미지 파일.
        }

        // 문항
        let questionCount = 0;
        questionsList.map((element) => {
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
                    return e;
                });
            } else if (questionType === 'O') {
                formData.append(`questions[${questionCount}].imgUrl`, element.imgUrl);
                formData.append(`questions[${questionCount}].title`, element.title);
                formData.append(`questions[${questionCount}].answer`, element.answer);

                if (element.questionSeq) {
                    formData.append(`questions[${questionCount}].questionSeq`, element.questionSeq);
                }

                if (element.imgFile) {
                    formData.append(`questions[${questionCount}].imgFile`, element.imgFile);
                }
                formData.append(`questions[${questionCount}].questionDesc`, element.questionDesc);
            }

            questionCount++;
            return element;
        });

        selectQuiz.map((item, index) => {
            formData.append(`quizRels[${index}].relType`, 'Q');
            formData.append(`quizRels[${index}].contentId`, item.contentId);
            // formData.append(`quizRels[${questionCount}].linkUrl`, ''); // URL 이 없어서..
            formData.append(`quizRels[${index}].title`, item.title);
            return item;
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
        const { quizSeq } = params;
        if (!isNaN(quizSeq) && selectQuizSeq.current !== quizSeq) {
            selectQuizSeq.current = quizSeq;
            dispatch(getQuizzes({ quizSeq: quizSeq }));
        } else if (history.location.pathname === '/quiz/add' && selectQuizSeq.current !== 'add') {
            selectQuizSeq.current = 'add';
            dispatch(clearQuizinfo());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <div className="d-flex">
            <MokaCard
                title="관련 정보"
                className="flex-fill"
                footer
                footerClassName="justify-content-center"
                footerButtons={[
                    { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-05' },
                    { text: '취소', variant: 'negative', onClick: () => history.push('/quiz'), className: 'mr-05' },
                ]}
                width={750}
            >
                <Form>
                    <hr />
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="pr-2">관련 투표</Form.Label>
                                    <Button variant="searching" size="sm" onClick={() => handleClickQuizSearchButton()}>
                                        퀴즈 검색
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    {selectQuiz.map((item, index) => {
                        return (
                            <Form.Row className="pb-2" key={index}>
                                <Col xs={3} className="pr-0 pl-5 d-flex align-content-center">
                                    <MokaInput value={item.contentId} disabled={true} />
                                </Col>
                                <Col xs={8} className="pl-0 d-flex align-items-center">
                                    <MokaInput value={item.title} disabled={true} />
                                </Col>
                                <Col xs={1} className="d-flex align-items-center">
                                    <Button size="sm" variant="negative" onClick={() => handleClickSelectQuizListDeleteButton(index)}>
                                        <MokaIcon iconName="fal-minus" />
                                    </Button>
                                </Col>
                            </Form.Row>
                        );
                    })}

                    <hr />
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="pr-2 mb-0">관련 정보</Form.Label>
                                    <Button variant="positive" onClick={handleClickArticleModalShow} className="mr-2">
                                        기사 검색
                                    </Button>
                                    <Button variant="positive" onClick={handleClickRelationArticleAdd}>
                                        추가
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12}>
                                <SortAgGrid />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Form>
            </MokaCard>
            <QuizSearchModal
                show={quizSearchModalState}
                onHide={() => {
                    setQuizSearchModalState(false);
                }}
            />
        </div>
    );
};

export default QuizChildRelationInfo;
