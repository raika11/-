import React, { useState, Suspense } from 'react';
import Helmet from 'react-helmet';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { notification, toastr } from '@utils/toastUtil';
import { clearStore, GET_REPORTER_MGR, CHANGE_REPORTER_MGR } from '@store/reporterMgr';

// relations
const ReporterMgrList = React.lazy(() => import('./ReporterMgrList'));
const ReporterMgrEdit = React.lazy(() => import('./ReporterMgrEdit'));

const ReporterMgr = () => {
    // 히스토리셋팅
    const history = useHistory();
    const dispatch = useDispatch();

    const { loading } = useSelector((store) => ({
        loading: store.loading[GET_REPORTER_MGR] || store.loading[CHANGE_REPORTER_MGR],
    }));

    // 마스터 그리드 클릭시 초기화 이벤트
    const handleClickAddGroup = (e) => {
        history.push('/reporterMgr');
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>기자 관리</title>
                <meta name="description" content="기자 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard
                title="기자 관리"
                width={480}
                titleClassName="h-100 mb-0 pb-0"
                headerClassName="d-flex justify-content-between align-item-center"
                className="mb-0 mr-10"
                height={CARD_DEFAULT_HEIGHT}
            >
                <Suspense>
                    <ReporterMgrList />
                </Suspense>
            </MokaCard>

            {/* 도메인 정보 */}
            <MokaCard
                title="기자 정보"
                width={1100}
                titleClassName="mb-0"
                headerClassName="d-flex justify-content-between align-item-center"
                height={CARD_DEFAULT_HEIGHT}
                loading={loading}
            >
                <Suspense>
                    <Switch>
                        <Route path={['/reporterMgr', '/reporterMgr/:repSeq']} exact render={() => <ReporterMgrEdit />} />
                    </Switch>
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default ReporterMgr;
