import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import DeskingList from './DeskingList';

import { MokaCard } from '@components';

const DeskingTab = React.lazy(() => import('./DeskingTab'));

/**
 * 화면편집
 */
const Desking = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>화면편집</title>
                <meta name="description" content="화면편집페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Suspense>
                <DeskingList />
            </Suspense>

            <DeskingTab />
        </div>
    );
};

export default Desking;
