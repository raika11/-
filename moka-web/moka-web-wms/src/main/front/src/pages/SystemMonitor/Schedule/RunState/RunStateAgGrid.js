import React, { useState, useCallback } from 'react';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './RunStateAgGridColumns';

/**
 * 스케줄 서버 관리 > 작업 실행상태 현황 AgGrid
 */
const RunStateAgGrid = () => {
    const [loading] = useState(false);
    const [total] = useState(0);
    const [search] = useState({ page: 0, size: 20 });

    const handleRowClicked = useCallback(() => {}, []);

    const handleChangeSearchOption = useCallback(() => {}, []);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.type}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={source.sourceCode}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default RunStateAgGrid;