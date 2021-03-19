import React from 'react';
import { useSelector } from 'react-redux';
import { MokaTable } from '@/components';
import { GET_BULK_STAT_TOTAL } from '@/store/bulks';
import columnDefs from './BulkMonitorSumAgGridColumns';

/**
 * 벌크 모니터링 현황
 */
const BulkMonitorSumAgGrid = () => {
    const search = useSelector((store) => store.bulkMonitor.search);
    const totalList = useSelector((store) => store.bulkMonitor.totalList);
    const loading = useSelector((store) => store.loading[GET_BULK_STAT_TOTAL]);

    return (
        <>
            <div className="mb-2 text-right">
                <p className="mb-0">
                    <span className="mr-4">
                        {search.startDt} ~ {search.endDt}
                    </span>
                    벌크 현황 정보
                </p>
            </div>
            <div className="mb-14 d-flex">
                <MokaTable
                    className="overflow-hidden flex-fill ag-grid-align-center"
                    agGridHeight={173}
                    columnDefs={columnDefs}
                    onRowNodeId={(params) => params.status}
                    rowData={totalList}
                    paging={false}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default BulkMonitorSumAgGrid;
