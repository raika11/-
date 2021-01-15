import React, { useState, useCallback } from 'react';
import { MokaCard, MokaTable } from '@/components';
import columnDefs, { rowData } from './BulKMonitorRcvprogsAgGridColumns.js';

/**
 * 벌크 모니터링 목록
 */
const BulKMonitorRcvprogsAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 0, size: 20 });

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    return (
        <MokaCard className="w-100 d-flex flex-column" height={545} header={false}>
            <MokaTable
                className="ag-grid-align-center"
                agGridHeight={460}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(params) => params.seqNo}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaCard>
    );
};

export default BulKMonitorRcvprogsAgGrid;
