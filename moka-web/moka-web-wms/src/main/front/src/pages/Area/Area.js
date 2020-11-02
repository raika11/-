import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_TP } from '@/constants';

const AreaList = React.lazy(() => import('./AreaList'));

/**
 * 편집영역관리
 */
const Area = () => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>편집영역관리</title>
                <meta name="description" content="편집영역관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 편집영역 리스트 */}
            <Suspense>
                <AreaList />
            </Suspense>
        </div>
    );
};

export default Area;
