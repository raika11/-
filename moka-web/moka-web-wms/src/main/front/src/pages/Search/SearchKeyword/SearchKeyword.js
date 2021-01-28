import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { MokaCard } from '@components';
import SearchKeywordDetail from './SearchKeywordDetail';
const SearchKeywordList = React.lazy(() => import('./SearchKeywordList'));

/**
 * 검색 로그
 */
const SearchKeyword = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>검색 로그</title>
                <meta name="description" content="검색 로그페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={900} className="mr-gutter" title="검색 로그" bodyClassName="d-flex flex-column">
                <Suspense>
                    <SearchKeywordList match={match} />
                </Suspense>
            </MokaCard>

            <Route path={[`${match.url}/:keyword`]} exact render={() => <SearchKeywordDetail match={match} />} />
        </div>
    );
};

export default SearchKeyword;
