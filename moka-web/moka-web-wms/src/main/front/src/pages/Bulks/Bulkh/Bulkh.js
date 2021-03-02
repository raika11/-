import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MokaLoader } from '@components';

// const BulkhMain = React.lazy(() => import('./Component/BulkhMain'));
// const BulkhHotClickList = React.lazy(() => import('./Component/BulkhHotClickList'));
// const BulkhArticleTab = React.lazy(() => import('./Component/BulkhArticleTab'));

import BulkhHotClickList from './Component/BulkhHotClickList';
import BulkhArticleTab from './Component/BulkhArticleTab';

const Bulkh = () => {
    const [componentAgGridInstances, setComponentAgGridInstances] = useState([]);

    // 공통 구분값 URL
    const { bulkPathName } = useSelector((store) => ({
        bulkPathName: store.bulks.bulkPathName,
    }));

    return (
        <div className="d-flex">
            <Helmet>
                <title>아티클 핫클릭 편집</title>
                <meta name="description" content="아티클 핫클릭 편집 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 임시. */}
            {/* <Switch>
                <Route path={[`/${bulkPathName}`, `/${bulkPathName}/:seqNo`]} exact render={() => <BulkhMain />} />
            </Switch> */}

            {/* 수정창 */}
            <Switch>
                <Route
                    path={[`/${bulkPathName}`, `/${bulkPathName}/:seqNo`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <BulkhHotClickList componentAgGridInstances={componentAgGridInstances} setComponentAgGridInstances={setComponentAgGridInstances} />
                            <BulkhArticleTab componentAgGridInstances={componentAgGridInstances} />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Bulkh;
