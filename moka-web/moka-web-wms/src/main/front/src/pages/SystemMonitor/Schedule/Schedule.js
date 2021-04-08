import React, { useState, useEffect, useCallback } from 'react';
import { Route, Switch } from 'react-router';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaCardTabs } from '@/components';
import { clearStore } from '@/store/schedule';
import { RunStateList } from './RunState';
import { WorkList } from './Work';
import { DeleteWorkList } from './DeleteWork';
import { DeployServerList } from './DeployServer';
import { BackOfficeWorkList } from './BackOfficeWork';
import ScheduleEdit from './ScheduleEdit';

/**
 * 시스템 모니터링 > 스케줄 서버 관리
 */
const Schedule = ({ match }) => {
    const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState(0);

    const [tabNavs] = useState(['작업 실행상태 현황', '작업 목록', '삭제 작업 목록', '배포 서버 관리', '백오피스 예약작업']);

    const createTabs = useCallback(() => {
        return tabNavs.map((nav, idx) => {
            if (nav === '작업 실행상태 현황') {
                return <RunStateList show={Number(activeKey) === idx} match={match} />;
            } else if (nav === '작업 목록') {
                return <WorkList show={Number(activeKey) === idx} match={match} />;
            } else if (nav === '삭제 작업 목록') {
                return <DeleteWorkList show={Number(activeKey) === idx} match={match} />;
            } else if (nav === '배포 서버 관리') {
                return <DeployServerList show={Number(activeKey) === idx} match={match} />;
            } else if (nav === '백오피스 예약작업') {
                return <BackOfficeWorkList show={Number(activeKey) === idx} match={match} />;
            }
            return null;
        });
    }, [activeKey, match, tabNavs]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>스케줄 서버 관리</title>
                <meta name="description" content="스케줄 서버 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 목록 */}
            <MokaCard className="mr-gutter" headerClassName="pb-0" bodyClassName="px-0 mb-0" width={900} title="스케줄 서버 관리">
                <MokaCardTabs className="w-100 h-100" navWidth={120} onSelectNav={(idx) => setActiveKey(idx)} tabs={createTabs()} tabNavs={tabNavs} />
            </MokaCard>

            {/* 편집 */}
            <Switch>
                <Route
                    path={[
                        `${match.path}`,
                        `${match.path}/work-list/add`,
                        `${match.path}/work-list/:jobSeq`,
                        `${match.path}/work-delete/:jobSeq`,
                        `${match.path}/deploy-server/add`,
                        `${match.path}/deploy-server/:serverSeq`,
                        `${match.path}/back-office-work/:seqNo`,
                    ]}
                    exact
                    render={() => <ScheduleEdit match={match} activeKey={activeKey} />}
                ></Route>
            </Switch>
        </div>
    );
};

export default Schedule;
