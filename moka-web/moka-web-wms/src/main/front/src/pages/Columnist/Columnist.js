import React, { useEffect, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { clearStore } from '@store/columnist';

const ColumnistList = React.lazy(() => import('./ColumnistList'));
const ColumnistEdit = React.lazy(() => import('@pages/Columnist/ColumnistEdit'));

const Columnist = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>칼럼니스트 관리</title>
                <meta name="description" content="칼럼니스트 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={940} className="mr-gutter" bodyClassName="d-flex flex-column" title="칼럼니스트 관리">
                <Suspense>
                    <ColumnistList match={match} />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route path={([`${match.path}/add`], [`${match.path}/:seqNo`])} exact render={(props) => <ColumnistEdit {...props} match={match} />} />
        </div>
    );
};

export default Columnist;
