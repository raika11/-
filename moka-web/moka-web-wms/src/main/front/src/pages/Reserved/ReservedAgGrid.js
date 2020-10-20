import React, { useState, useCallback } from 'react';
import { columnDefs } from './ReservedAgGridColumns';
import { MokaTable } from '@components';
/**
 * 예약어 AgGrid 컴포넌트
 */
const ReservedAgGrid = () => {
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
        <>
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={total}
                getRowNodeId={(params) => params.containerSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </>
    );
};

export default ReservedAgGrid;
