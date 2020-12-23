import React, { useState, useCallback } from 'react';
import columnDefs from './ArticleSourceAgGridColumns';
import { MokaTable } from '@/components';

const ArticleSourceAgGrid = () => {
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
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={total}
            // onRowNodeId={(params) => params.containerSeq}
            onRowClicked={handleRowClicked}
            // loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ArticleSourceAgGrid;