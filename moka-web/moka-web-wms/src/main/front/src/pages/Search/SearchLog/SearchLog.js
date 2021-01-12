import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaLoader } from '@components';
import SearchLogList from '@pages/Search/SearchLog/SearchLogList';
import { Route } from 'react-router-dom';
import SearchLogDetailInfo from '@pages/Search/SearchLog/SearchLogDetailInfo';

const SearchLog = ({ match }) => {
    return (
        <div className="d-flex">
            <Helmet>
                <title>검색 로그</title>
                <meta name="description" content="검색 로그페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard width={900} className="mr-gutter" titleClassName="mb-0" title="검색 로그">
                <Suspense fallback={<MokaLoader />}>
                    <SearchLogList />
                </Suspense>
            </MokaCard>

            <Route path={[`${match.url}/:keyword`]} exact render={(props) => <SearchLogDetailInfo {...props} />} />
        </div>
    );
};

export default SearchLog;
