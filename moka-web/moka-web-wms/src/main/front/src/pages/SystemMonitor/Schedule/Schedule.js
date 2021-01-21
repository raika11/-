import React from 'react';
import { Helmet } from 'react-helmet';
// import { Route, Switch } from 'react-router-dom';
import { MokaCardTabs } from '@/components';
import RunState from './RunState';

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
                tabContentClass="h-100"
                tabs={[
                    <RunState />,
                    // <ScheduleWorkList />,
                    // <ScheduleDeleteWorkList />,
                    // <ScheduleServer />
                ]}
                tabNavs={['작업 실행상태', '작업 목록', '삭제 작업 목록', '배포 서버 관리']}
            />
        </>
    );
};

export default Schedule;
