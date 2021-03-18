import React, { useState } from 'react';
import { MokaCard } from '@components';
import { useHistory } from 'react-router-dom';
import { Form, Col, Button } from 'react-bootstrap';
import SortAgGrid from '@pages/Survey/component/SortAgGrid';
import { QuizSearchModal } from '@pages/Survey/Quiz/modals';
import QuizSortAgGrid from './QuizSortAgGrid';

const QuizChildRelationInfo = ({ HandleSave }) => {
    const history = useHistory();

    const [quizSearchModalState, setQuizSearchModalState] = useState(false);

    // 퀴즈 검색 버튼.
    const handleClickQuizSearchButton = () => {
        setQuizSearchModalState(true);
    };

    // 정보창 오른쪽 텝이 2개 라서 실제 저장 기능은 QuizEdit 에서 처리 하기위해 props 로 저장 전달 처리.
    const handleClickSaveButton = () => {
        HandleSave();
    };

    return (
        <div className="d-flex">
            <MokaCard
                title="관련 정보"
                className="w-100"
                footer
                footerButtons={[
                    { text: '저장', variant: 'positive', onClick: () => handleClickSaveButton(), className: 'mr-05' },
                    { text: '취소', variant: 'negative', onClick: () => history.push('/quiz'), className: 'mr-05' },
                ]}
                width={750}
            >
                <Form>
                    {/* <hr /> */}
                    <Form.Group>
                        <Form.Row>
                            <Col xs={12} className="p-0">
                                <Form.Group>
                                    <Form.Label className="pr-2">관련 퀴즈</Form.Label>
                                    <Button variant="searching" size="s" onClick={() => handleClickQuizSearchButton()}>
                                        퀴즈 검색
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form.Group>

                    <QuizSortAgGrid />

                    <hr />

                    <SortAgGrid />
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
