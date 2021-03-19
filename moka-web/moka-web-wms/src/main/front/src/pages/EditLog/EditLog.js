import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/editLog';
import { MokaCard } from '@components';
import EditLogList from './EditLogList';
import EditLogInfo from './EditLogInfo';

/**
 * 시스템관리 > 로그관리
 */
const EditLog = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>로그 관리</title>
                <meta name="description" content="로그 관리페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={700} className="mr-gutter" bodyClassName="d-flex flex-column" title="로그 관리">
                <EditLogList match={match} />
            </MokaCard>

            <Route path={[`${match.url}/:seqNo`]} exact render={() => <EditLogInfo match={match} />} />
        </div>
    );
};

export default EditLog;
