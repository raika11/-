import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs } from '@components';
import { Route } from 'react-router-dom';
import QuizChildRelationInfo from '@pages/Survey/Quiz/relations/QuizChildRelationInfo';
import QuizList from '@pages/Survey/Quiz/QuizList';
import QuizEdit from '@pages/Survey/Quiz/QuizEdit';
import { Col } from 'react-bootstrap';
import clsx from 'clsx';
import useBreakpoint from '@hooks/useBreakpoint';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

const Quiz = ({ match }) => {
    const matchPoints = useBreakpoint();
    const [, setActiveTabIdx] = useState(0);
    const [handleSave, setHandleSave] = useState(false);

    // 저정 버튼 처리..
    // 정보창 오른쪽 텝에서( 관련 템)에서 저장을 눌렀을경우 props로 업데이트 버튼 이벤트를 전달해서 edit 창에서 저장..
    const handleSaveButtonClick = () => {
        setHandleSave(true);
    };

    return (
        <Container className="p-0 position-relative" fluid>
            <Row className="m-0">
                <Helmet>
                    <title>퀴즈 관리</title>
                    <meta name="description" content="퀴즈 관리페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 리스트 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard className="mr-gutter w-100" title="퀴즈 관리" bodyClassName="d-flex flex-column">
                        <Suspense>
                            <QuizList />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* 등록/수정 */}
                <Route
                    path={[`${match.url}/add`, `${match.url}/:quizSeq`]}
                    exact
                    render={(props) => {
                        let clazz = 'absolute-top-right h-100 overlay-shadow';
                        let xs = 7;
                        if (matchPoints.md || matchPoints.lg) {
                            xs = 5;
                            clazz = '';
                        }
                        return (
                            <Col xs={xs} className={clsx('p-0  color-bg-body', clazz)} style={{ zIndex: 2 }}>
                                <MokaIconTabs
                                    foldable={false}
                                    className="w-100"
                                    onSelectNave={(idx) => setActiveTabIdx(idx)}
                                    tabs={[
                                        <Suspense>
                                            <QuizEdit handleSave={handleSave} setHandleSave={() => setHandleSave(false)} />
                                        </Suspense>,
                                        <Suspense>
                                            <QuizChildRelationInfo HandleSave={() => handleSaveButtonClick()} />
                                        </Suspense>,
                                    ]}
                                    tabNavWidth={48}
                                    placement="left"
                                    tabNavs={[
                                        { title: '퀴즈 정보', text: 'Info' },
                                        { title: '관련 정보페이지', text: '관련' },
                                    ]}
                                    hasHotkeys={true}
                                />
                            </Col>
                        );
                    }}
                />
            </Row>
        </Container>
    );
};

export default Quiz;
