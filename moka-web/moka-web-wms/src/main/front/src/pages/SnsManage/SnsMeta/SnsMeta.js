import React, { Suspense, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaLoader } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import commonUtil from '@utils/commonUtil';
import { clearMetaStore } from '@store/snsManage';
import { clearSpecialCharCode } from '@store/codeMgt';

const SnsMetaList = React.lazy(() => import('./SnsMetaList'));
const SnsMetaEdit = React.lazy(() => import('./SnsMetaEdit'));

/**
 * FB & TW
 */
const SnsMeta = ({ match }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearMetaStore());
            dispatch(clearSpecialCharCode());
        };
    }, [dispatch]);

    const { totalId } = useSelector((store) => ({ totalId: store.sns.meta.meta.totalId }));

    return (
        <div className="d-flex">
            <Helmet>
                <title>FB & TW</title>
                <meta name="description" content="FB & TW 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={1030} className="mr-gutter" titleClassName="mb-0" header={false}>
                <Suspense fallback={<MokaLoader />}>
                    <SnsMetaList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[`${match.url}/:totalId`]}
                exact
                render={(props) => (
                    <Suspense fallback={<MokaLoader />}>
                        <SnsMetaEdit {...props} />
                    </Suspense>
                )}
            />
        </div>
    );
};

export default SnsMeta;
