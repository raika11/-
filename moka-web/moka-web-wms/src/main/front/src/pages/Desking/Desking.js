import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

const DeskingList = React.lazy(() => import('./DeskingList'));
const DeskingWorkList = React.lazy(() => import('./DeskingWorkList'));
const DeskingTab = React.lazy(() => import('./DeskingTab'));

/**
 * 페이지편집
 */
const Desking = ({ match }) => {
    // 컴포넌트 ag-grid 인스턴스 리스트를 state로 관리
    const [componentAgGridInstances, setComponentAgGridInstances] = useState([]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>페이지편집</title>
                <meta name="description" content="페이지편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 데스킹 트리 */}
            <Suspense>
                <DeskingList />
            </Suspense>

            <Switch>
                <Route
                    path={['/desking', '/desking/:areaSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 데스킹 워크 */}
                            <Suspense>
                                <DeskingWorkList componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
                            </Suspense>
                        </>
                    )}
                />
            </Switch>

            {/* 데스킹 탭 */}
            <Suspense>
                <DeskingTab componentAgGridInstances={componentAgGridInstances} />
            </Suspense>
        </div>
    );
};

export default Desking;
