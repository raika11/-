import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import MokaLoader from '@components/MokaLoader';
import SEOMetaList from '@pages/SEOMeta/SEOMetaList';
import { Route } from 'react-router-dom';
import SEOMetaEdit from '@pages/SEOMeta/SEOMetaEdit';

const SEOMeta = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>SEO 메타관리</title>
                <meta name="description" content="SEO메타 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={1100} className="mr-gutter" titleClassName="mb-0" title="SEO메타관리">
                <Suspense fallback={<MokaLoader />}>
                    <SEOMetaList />
                </Suspense>
            </MokaCard>

            <Route path={[`${match.url}/add`, `${match.url}/:seoSeq`]} exact render={(props) => <SEOMetaEdit />} />
        </div>
    );
};

export default SEOMeta;
