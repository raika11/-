import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/desking';
import DeskingTree from './DeskingTree';
import ComponentWorkList from './ComponentWorkList';
import DeskingTab from './DeskingTab';

/**
 * 홈 섹션편집
 * 페이지 편집 하위 메뉴는 min-height 지정, h-100
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
        <div className="d-flex h-100" style={{ minHeight: 817 }}>
            <Helmet>
                <title>페이지편집</title>
                <meta name="description" content="페이지편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 데스킹 트리 */}
            <Switch>
                <Route path={[match.path, `${match.path}/:areaSeq`]} exact render={() => <DeskingTree match={match} setComponentAgGridInstances={setComponentAgGridInstances} />} />
            </Switch>

            {/* 워크 */}
            <ComponentWorkList componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />

            {/* 데스킹 탭 */}
            <DeskingTab componentAgGridInstances={componentAgGridInstances} />
        </div>
    );
};

export default Desking;
