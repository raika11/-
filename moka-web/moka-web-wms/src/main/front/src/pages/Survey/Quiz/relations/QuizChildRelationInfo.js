import React, { useState, useEffect } from 'react';
import { MokaCard, MokaInput, MokaIcon } from '@components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Col, Button } from 'react-bootstrap';

import ArticleAgGrid from '@pages/Survey/component/articleGrid/ArticleAgGrid';
import { QuizSearchModal } from '@pages/Survey/Quiz/modals';
import { initialState } from '@store/survey/quiz';

const QuizChildRelationInfo = () => {
    const history = useHistory();
    const { selectQuiz } = useSelector((store) => ({
        selectQuiz: store.quiz.selectQuiz,
    }));

    const [selectQuizList, setSelectQuizList] = useState([]);

    const [quizSearchModalState, setQuizSearchModalState] = useState(false);

    const handleClickArticleModalShow = () => {};
    const handleClickRelationArticleAdd = () => {};
    const handleClickSelectQuizListDeleteButton = (itemIndex) => {
        setSelectQuizList(selectQuizList.filter((e, i) => i !== itemIndex));
    };

    const handleClickQuizSearchButton = () => {
        setQuizSearchModalState(true);
    };

    useEffect(() => {
        const addSelectQuiz = (data) => {
            setSelectQuizList([...selectQuizList, data]);
        };

        if (selectQuiz !== initialState.selectQuiz) {
            addSelectQuiz(selectQuiz);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectQuiz]);

    useEffect(() => {
        console.log(selectQuizList);
    }, [selectQuizList]);

    return (
        <div className="d-flex">
            <MokaCard
                title="관련 정보"
                className="flex-fill"
                footer
                footerClassName="justify-content-center"
                footerButtons={[
                    { text: '저장', variant: 'positive', onClick: () => console.log('저장'), className: 'mr-05' },
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
                    {selectQuizList.map((item, index) => {
                        return (
                            <>
                                <Form.Row className="pb-2">
                                    <Col xs={3} className="pr-0 pl-5 d-flex align-content-center">
                                        <MokaInput value={item.quizSeq} disabled={true} />
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
                            </>
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
                                <ArticleAgGrid />
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
