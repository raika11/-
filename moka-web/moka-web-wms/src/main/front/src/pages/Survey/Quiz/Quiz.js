import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs } from '@components';
import { Route } from 'react-router-dom';
import QuizChildRelationInfo from '@pages/Survey/Quiz/relations/QuizChildRelationInfo';
import QuizList from '@pages/Survey/Quiz/QuizList';
import QuizEdit from '@pages/Survey/Quiz/QuizEdit';

const Quiz = ({ match }) => {
    const [, setActiveTabIdx] = useState(0);
    const [handleSave, setHandleSave] = useState(false);

    // 저정 버튼 처리..
    // 정보창 오른쪽 텝에서( 관련 템)에서 저장을 눌렀을경우 props로 업데이트 버튼 이벤트를 전달해서 edit 창에서 저장..
    const handleSaveButtonClick = () => {
        setHandleSave(true);
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>퀴즈 관리</title>
                <meta name="description" content="퀴즈 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={798} className="mr-gutter" titleClassName="mb-0" title="퀴즈 관리">
                <Suspense>
                    <QuizList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정 */}
            <Route
                path={[`${match.url}/add`, `${match.url}/:quizSeq`]}
                exact
                render={(props) => (
                    <MokaIconTabs
                        foldable={false}
                        tabWidth={750}
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
                            { title: '투표 정보', text: 'Info' },
                            { title: '관련 정보페이지', text: '관련' },
                        ]}
                    />
                )}
            />
        </div>
    );
};

export default Quiz;
