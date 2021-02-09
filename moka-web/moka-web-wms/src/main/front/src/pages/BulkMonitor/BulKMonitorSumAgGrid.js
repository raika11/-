import React from 'react';
import { useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import { GET_BULK_STAT_TOTAL } from '@/store/bulks';
import columnDefs from './BulkMonitorSumAgGridColumns';

/**
 * 벌크 모니터링 현황
 */
const BulKMonitorSumAgGrid = () => {
    const search = useSelector((store) => store.bulkMonitor.search);
    const totalList = useSelector((store) => store.bulkMonitor.totalList);
    const loading = useSelector((store) => store.loading[GET_BULK_STAT_TOTAL]);

    return (
        <div className="mb-5 d-flex align-items-center" style={{ width: 786 }}>
            <div className="mr-3 text-center">
                <p className="mb-0">
                    {search.startDt} ~ {search.endDt}
                </p>
                <p className="mb-0">벌크 현황 정보</p>
            </div>
            <MokaTable
                className="flex-fill ag-grid-align-center"
                columnDefs={columnDefs}
                onRowNodeId={(params) => params.status}
                rowData={totalList}
                paging={false}
                loading={loading}
            />
        </div>
    );
};

export default BulKMonitorSumAgGrid;
