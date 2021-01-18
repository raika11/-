import React from 'react';
import { MokaCard, MokaTable } from '@/components';
import columnDefs, { rowData } from './BulkMonitorSumAgGridColumns';

/**
 * 벌크 모니터링 현황
 */
const BulKMonitorSumAgGrid = () => {
    return (
        <MokaCard className="mb-5" bodyClassName="d-flex align-items-center" width={805} height={150} header={false}>
            <p className="mb-0 mr-3">벌크 현황 정보</p>
            <MokaTable className="flex-fill ag-grid-align-center" columnDefs={columnDefs} onRowNodeId={(params) => params.progress} rowData={rowData} paging={false} />
        </MokaCard>
    );
};

export default BulKMonitorSumAgGrid;
