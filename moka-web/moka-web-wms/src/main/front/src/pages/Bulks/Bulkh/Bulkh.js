import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MokaLoader } from '@components';
import BulkhHotClickList from './Component/BulkhHotClickList';
import BulkhArticleTab from './Component/BulkhArticleTab';

/**
 * 아티클 핫클릭
 * 페이지 편집 하위 메뉴는 min-height 지정, h-100
 */
const Bulkh = () => {
    const [componentAgGridInstances, setComponentAgGridInstances] = useState([]);
    const bulkPathName = useSelector(({ bulks }) => bulks.bulkPathName); // 공통 구분값 URL

    return (
        <div className="d-flex h-100" style={{ minHeight: 817 }}>
            <Helmet>
                <title>아티클 핫클릭 편집</title>
                <meta name="description" content="아티클 핫클릭 편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Switch>
                <Route
                    path={[`/${bulkPathName}`, `/${bulkPathName}/:seqNo`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            {/* 목록 */}
                            <BulkhHotClickList componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
                            {/* 수정 */}
                            <BulkhArticleTab componentAgGridInstances={componentAgGridInstances} />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Bulkh;
