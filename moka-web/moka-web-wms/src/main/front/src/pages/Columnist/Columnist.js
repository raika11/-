import React, { useEffect, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { clearStore } from '@store/columNist';

const ColumnistList = React.lazy(() => import('./ColumnistList'));
const ColumnistEdit = React.lazy(() => import('./ColumnistEdit'));

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
            <MokaCard width={840} className="mr-gutter flex-fill" titleClassName="mb-0" header={false}>
                <Suspense>
                    <ColumnistList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[match.url, `${match.url}/:linkSeq`]}
                exact
                render={(props) => (
                    <Suspense>
                        <ColumnistEdit {...props} />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default Columnist;
