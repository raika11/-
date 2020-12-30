import React, { useState, useCallback } from 'react';
import { MokaTable } from '@/components';
import columnDefs from './TourListAgGridColumns';

/**
 * 신청목록 AgGrid
 */
const TourListAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaTable
            agGridHeight={632}
            columnDefs={columnDefs}
            rowData={total}
            onRowNodeId={(params) => params.seqNo}
            onRowClicked={handleRowClicked}
            // loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default TourListAgGrid;
