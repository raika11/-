import React from 'react';
import Helmet from 'react-helmet';
import { MokaCard } from '@/components';
import BulkMonitorSearch from './BulkMonitorSearch';
import BulkMonitorSumAgGrid from './BulkMonitorSumAgGrid';
import BulkMonitorRcvprogsAgGrid from './BulkMonitorRcvprogsAgGrid';

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

            <MokaCard title="벌크 모니터링" bodyClassName="d-flex flex-column" width={1596}>
                {/* 벌크 모니터링 검색 */}
                <BulkMonitorSearch />

                {/* 벌크 모니터링 현황 */}
                <div className="d-flex justify-content-center">
                    <BulkMonitorSumAgGrid />
                </div>

                {/* 벌크 전송 목록 */}
                <BulkMonitorRcvprogsAgGrid />
            </MokaCard>
        </>
    );
};

export default BulkMonitor;
