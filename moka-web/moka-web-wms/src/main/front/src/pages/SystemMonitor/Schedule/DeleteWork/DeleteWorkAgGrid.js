import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { MokaTable } from '@/components';
import columnDefs, { rowData } from './DeleteWorkAgGridColumns';

/**
 * 스케줄 서버 관리 > 삭제 작업 목록 AgGrid
 */
const DeleteWorkAgGrid = () => {
    const history = useHistory();
    const [loading] = useState(false);
    const [total] = useState(0);
    const [search] = useState({ page: 0, size: 20 });

    /**
     * 테이블 row 클릭
     */
    const handleRowClicked = useCallback(
        (row) => {
            history.push(`/schedule/work-delete/${row.seqNo}`);
        },
        [history],
    );

    const handleChangeSearchOption = useCallback(() => {}, []);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={(row) => row.seqNo}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default DeleteWorkAgGrid;
