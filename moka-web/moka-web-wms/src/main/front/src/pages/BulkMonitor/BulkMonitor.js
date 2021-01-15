import React from 'react';
import Helmet from 'react-helmet';
import BulkMonitorSearch from './BulkMonitorSearch';
import BulKMonitorSumAgGrid from './BulKMonitorSumAgGrid';
import BulKMonitorRcvprogsAgGrid from './BulKMonitorRcvprogsAgGrid';

/**
 * 벌크 모니터링
 */
const BulkMonitor = () => {
    return (
        <>
            <Helmet>
                <title>벌크 모니터링</title>
                <meta name="description" content="벌크 모니터링 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 벌크 모니터링 검색 */}
            <BulkMonitorSearch />

            <div className="d-flex justify-content-center">
                {/* 벌크 모니터링 현황 정보 */}
                <BulKMonitorSumAgGrid />
            </div>

            {/* 벌크 모니터링 목록 */}
            <BulKMonitorRcvprogsAgGrid />
        </>
    );
};

export default BulkMonitor;
