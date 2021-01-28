import React, { Suspense, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs, MokaLoader } from '@components';
import { Route } from 'react-router-dom';
import QuizChildRelationInfo from '@pages/Survey/Quiz/relations/QuizChildRelationInfo';

import QuizList from '@pages/Survey/Quiz/QuizList';
import QuizEdit from '@pages/Survey/Quiz/QuizEdit';

const Quiz = ({ match }) => {
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    return (
        <div className="d-flex">
            <Helmet>
                <title>퀴즈 관리</title>
                <meta name="description" content="퀴즈 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={798} className="mr-gutter" titleClassName="mb-0" title="퀴즈 관리">
                <Suspense fallback={<MokaLoader />}>
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
                            <Suspense fallback={<MokaLoader />}>
                                <QuizEdit />
                            </Suspense>,
                            <Suspense fallback={<MokaLoader />}>
                                <QuizChildRelationInfo />
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
