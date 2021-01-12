import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './TourListAgGridColumns';

/**
 * 신청목록 AgGrid
 */
const TourListAgGrid = () => {
    const history = useHistory();
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
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`/tour-list/${row.seqNo}`);
        },
        [history],
    );

    return (
        <MokaTable
            agGridHeight={632}
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(params) => params.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={rowData[0].seqNo}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default TourListAgGrid;
