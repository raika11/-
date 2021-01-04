import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs, MokaLoader } from '@components';
import { Route } from 'react-router-dom';

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
                <Suspense fallback={<MokaLoader />}></Suspense>
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
                                <MokaCard keys={1} width={750} title="퀴즈 등록">
                                    <div>투표 등록</div>
                                </MokaCard>
                            </Suspense>,
                            <Suspense fallback={<MokaLoader />}>
                                <MokaCard keys={2} width={750} title="관련 정보">
                                    <div>관련 정보</div>
                                </MokaCard>
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
