import React, { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import MokaLoader from '@components/MokaLoader';
import SEOMetaList from '@pages/SEOMeta/SEOMetaList';
import { Route } from 'react-router-dom';
import SEOMetaEdit from '@pages/SEOMeta/SEOMetaEdit';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/seoMeta';

const SEOMeta = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>SEO 메타관리</title>
                <meta name="description" content="SEO 메타관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={1100} className="mr-gutter" titleClassName="mb-0" title="SEO 메타관리">
                <Suspense fallback={<MokaLoader />}>
                    <SEOMetaList />
                </Suspense>
            </MokaCard>

            <Route path={[`${match.url}/:totalId`]} exact render={(props) => <SEOMetaEdit />} />
        </div>
    );
};

export default SEOMeta;
