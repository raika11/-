import React from 'react';
import { Helmet } from 'react-helmet';
import { MokaCardTabs } from '@/components';
import RunState from './RunState/index';
import Work from './Work/index';
import DeleteWork from './DeleteWork/index';
import DeployServer from './DeployServer/index';

/**
 * 스케줄 서버 관리
 */
const Schedule = ({ match }) => {
    return (
        <>
            <Helmet>
                <title>스케줄 서버 관리</title>
                <meta name="description" content="스케줄 서버 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCardTabs
                width={1596}
                navWidth={120}
                tabContentClass="h-100"
                tabs={[<RunState match={match} />, <Work match={match} />, <DeleteWork match={match} />, <DeployServer match={match} />]}
                tabNavs={['작업 실행상태', '작업 목록', '삭제 작업 목록', '배포 서버 관리']}
            />
        </>
    );
};

export default Schedule;
