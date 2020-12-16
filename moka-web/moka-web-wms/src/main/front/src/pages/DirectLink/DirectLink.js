import React, { useEffect, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { clearStore } from '@store/directLink';

const DirectLinkList = React.lazy(() => import('./DirectLinkList'));
const DirectLinkEdit = React.lazy(() => import('./DirectLinkEdit'));

/**
 * 사이트 바로 가기 관리
 */
const DirectLink = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>사이트 바로 가기</title>
                <meta name="description" content="사이트 바로 가기 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={840} className="mr-gutter flex-fill" titleClassName="mb-0" bodyClassName="d-flex flex-column" header={false}>
                <Suspense>
                    <DirectLinkList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[match.url, `${match.url}/:linkSeq`]}
                exact
                render={(props) => (
                    <Suspense>
                        <DirectLinkEdit {...props} />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default DirectLink;
