import React, { Suspense, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import commonUtil from '@utils/commonUtil';
import { clearMetaStore } from '@store/snsManage';

const SnsMetaList = React.lazy(() => import('./SnsMetaList'));
const SnsMetaEdit = React.lazy(() => import('./SnsMetaEdit'));

/**
 * FB & TW
 */
const SnsMeta = ({ match }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('들어옴');
        return () => {
            dispatch(clearMetaStore());
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
            <MokaCard width={450} className="mr-gutter flex-fill" titleClassName="mb-0" header={false}>
                <Suspense>
                    <SnsMetaList />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[match.url, `${match.url}/:totalId`]}
                exact
                render={(props) => (
                    <Suspense>
                        <div style={!commonUtil.isEmpty(totalId) ? { display: 'block' } : { display: 'none' }}>
                            <SnsMetaEdit {...props} />
                        </div>
                    </Suspense>
                )}
            />
        </div>
    );
};

export default SnsMeta;
