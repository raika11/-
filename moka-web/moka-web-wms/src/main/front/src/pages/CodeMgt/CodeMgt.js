import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import { MokaCard } from '@components';

const CodeMgtList = React.lazy(() => import('./CodeMgtList'));
const CodeMgtEdit = React.lazy(() => import('./CodeMgtEdit'));

/**
 * 기타코드 관리 컴포넌트
 */
const CodeMgt = () => {
    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>기타코드관리</title>
                    <meta name="description" content="기타코드관리페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 기타코드 리스트 */}
                <MokaCard width={260} className="mr-gutter" titleClassName="mb-0" header={false}>
                    <Suspense>
                        <CodeMgtList />
                    </Suspense>
                </MokaCard>

                <Switch>
                    <Route
                        path={['/codeMgt', '/codeMgt/:grpCd', '/codeMgt/:grpCd/:cdSeq']}
                        exact
                        render={() => (
                            <>
                                {/* 기타코드 편집 */}
                                <MokaCard width={1300} titleClassName="mb-0" header={false}>
                                    <Suspense>
                                        <CodeMgtEdit />
                                    </Suspense>
                                </MokaCard>
                            </>
                        )}
                    />
                </Switch>
            </div>
        </>
    );
};

export default CodeMgt;
