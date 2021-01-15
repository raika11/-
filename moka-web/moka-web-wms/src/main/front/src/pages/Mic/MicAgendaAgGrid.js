import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './MicAgendaAgGridColumns';

/**
 * 시민 마이크 아젠다 목록 Ag Grid
 */
const MicAgendaAgGrid = () => {
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
            history.push(`/mic/${row.seqNo}`);
        },
        [history],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(params) => params.seqNo}
            onRowClicked={handleRowClicked}
            // loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            // selected={rowData.seqNo}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default MicAgendaAgGrid;
