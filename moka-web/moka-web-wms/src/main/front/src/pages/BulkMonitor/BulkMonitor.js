import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { MokaCard } from '@/components';
import BulkMonitorSearch from './BulkMonitorSearch';
import BulkMonitorSumAgGrid from './BulkMonitorSumAgGrid';
import BulkMonitorRcvProgsAgGrid from './BulkMonitorRcvProgsAgGrid';
import { clearBmStore } from '@store/bulks';

/**
 * 벌크 모니터링
 */
const BulkMonitor = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearBmStore());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Helmet>
                <title>벌크 모니터링</title>
                <meta name="description" content="벌크 모니터링 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <MokaCard title="벌크 모니터링" className="w-100" bodyClassName="d-flex flex-column">
                {/* 벌크 모니터링 검색 */}
                <BulkMonitorSearch />

                {/* 벌크 모니터링 현황 */}
                <BulkMonitorSumAgGrid />

                {/* 벌크 전송 목록 */}
                <BulkMonitorRcvProgsAgGrid />
            </MokaCard>
        </>
    );
};

export default BulkMonitor;
