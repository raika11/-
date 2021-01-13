import React from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import SystemLogList from '@pages/SystemLog/SystemLogList';
import { Route } from 'react-router-dom';
import SystemLogInfo from '@pages/SystemLog/SystemLogInfo';

const SystemLog = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>로그 관리</title>
                <meta name="description" content="로그 관리페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={700} className="mr-gutter" titleClassName="mb-0" title="로그 관리">
                <SystemLogList />
            </MokaCard>

            <Route path={[`${match.url}/:logSeq`]} exact render={(props) => <SystemLogInfo />} />
        </div>
    );
};

export default SystemLog;
