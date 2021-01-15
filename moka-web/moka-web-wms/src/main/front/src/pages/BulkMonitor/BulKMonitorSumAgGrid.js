import React from 'react';
import { MokaCard, MokaTable } from '@/components';
import columnDefs, { rowData } from './BulkMonitorSumAgGridColumns';

/**
 * 벌크 모니터링 현황
 */
const BulKMonitorSumAgGrid = () => {
    return (
        <MokaCard className="mb-5" width={710} height={150} header={false}>
            <MokaTable className="flex-fill ag-grid-align-center" columnDefs={columnDefs} onRowNodeId={(params) => params.progress} rowData={rowData} paging={false} />
        </MokaCard>
    );
};

export default BulKMonitorSumAgGrid;
