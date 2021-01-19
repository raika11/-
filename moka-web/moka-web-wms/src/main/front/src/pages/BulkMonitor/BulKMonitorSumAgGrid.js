import React from 'react';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './BulkMonitorSumAgGridColumns';

/**
 * 벌크 모니터링 현황
 */
const BulKMonitorSumAgGrid = () => {
    return (
        <div className="mb-5 d-flex align-items-center" style={{ width: 758 }}>
            <p className="mb-0 mr-3">벌크 현황 정보</p>
            <MokaTable className="flex-fill ag-grid-align-center" columnDefs={columnDefs} onRowNodeId={(params) => params.progress} rowData={rowData} paging={false} />
        </div>
    );
};

export default BulKMonitorSumAgGrid;
