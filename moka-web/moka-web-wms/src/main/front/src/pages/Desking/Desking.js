import React, { Suspense, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/desking';

const DeskingTree = React.lazy(() => import('./DeskingTree'));
const ComponentWorkList = React.lazy(() => import('./ComponentWorkList'));
const DeskingTab = React.lazy(() => import('./DeskingTab'));

/**
 * 페이지 편집
 */
const Desking = ({ match }) => {
    const dispatch = useDispatch();

    // 컴포넌트 ag-grid 인스턴스 리스트를 state로 관리
    const [componentAgGridInstances, setComponentAgGridInstances] = useState([]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>페이지편집</title>
                <meta name="description" content="페이지편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 데스킹 트리 */}
            <Switch>
                <Route path={[match.url, `${match.url}/:areaSeq`]} exact render={() => <DeskingTree />} />
            </Switch>

            {/* 워크 */}
            <Suspense>
                <ComponentWorkList componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
            </Suspense>

            {/* 데스킹 탭 */}
            <Suspense>
                <DeskingTab componentAgGridInstances={componentAgGridInstances} />
            </Suspense>
        </div>
    );
};

export default Desking;
