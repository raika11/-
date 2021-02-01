import React, { useState } from 'react';
import { MokaCard } from '@components';
import { useHistory } from 'react-router-dom';
import { Form, Col, Button } from 'react-bootstrap';

import ArticleAgGrid from '@pages/Survey/component/articleGrid/ArticleAgGrid';
import { QuizSearchModal } from '@pages/Survey/Quiz/modals';

const QuizChildRelationInfo = () => {
    const history = useHistory();

    const [quizSearchModalState, setQuizSearchModalState] = useState(false);

    const handleClickArticleModalShow = () => {};
    const handleClickRelationArticleAdd = () => {};

    const handleClickQuizSearchButton = () => {
        setQuizSearchModalState(true);
    };

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
