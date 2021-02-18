import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MokaCard } from '@components';
import SEOMetaList from '@pages/SEOMeta/SEOMetaList';
import SEOMetaEdit from '@pages/SEOMeta/SEOMetaEdit';
import { clearStore } from '@store/seoMeta';

/**
 * SEO 메타 관리
 */
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
                <meta name="description" content="SEO 메타관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={1100} className="mr-gutter" titleClassName="mb-0" title="SEO 메타관리">
                <SEOMetaList match={match} />
            </MokaCard>

            <Route path={[`${match.url}/:totalId`]} exact render={() => <SEOMetaEdit match={match} />} />
        </div>
    );
};

export default SEOMeta;
