import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Route, Switch, useHistory } from 'react-router-dom';
import { MokaCard } from '@/components';
import { clearStore } from '@/store/tour';
import TourListApplyList from './TourListApplyList';
import TourListEdit from './TourListEdit';

/**
 * 견학 신청 목록
 */
const TourList = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex">
            <Helmet>
                <title>신청 목록</title>
                <meta name="description" content="견학 신청 목록 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 신청 목록 */}
            <MokaCard width={948} className="mr-gutter" bodyClassName="d-flex flex-column" title="신청 목록">
                <TourListApplyList match={match} />
            </MokaCard>

            {/* 견학 신청서 */}
            <Switch>
                <Route path={[`${match.url}/:tourSeq`]} exact render={() => <TourListEdit match={match} />} />
            </Switch>
        </div>
    );
};

export default TourList;
