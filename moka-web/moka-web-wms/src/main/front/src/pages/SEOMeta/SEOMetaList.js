import React from 'react';
import SEOMetaSearch from '@pages/SEOMeta/SEOMetaSearch';
import SEOMetaAgGrid from '@pages/SEOMeta/SEOMetaAgGrid';

/**
 * SEO 메타 목록
 */
const SEOMetaList = ({ match }) => {
    return (
        <>
            {/* SEO 메타 검색 */}
            <SEOMetaSearch />

            {/* SEO 메타 목록 */}
            <SEOMetaAgGrid match={match} />
        </>
    );
};

export default SEOMetaList;
