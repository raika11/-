import React, { useState, useCallback } from 'react';
import { MokaTable } from '@/components';
import columnDefs from './ArticlePackageAgGridColumns';
import { GRID_HEADER_HEIGHT } from '@/style_constants';

/**
 * 패키지 관리 > 기사 패키지 > 패키지 목록 AgGrid
 */
const ArticlePackageAgGrid = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaTable
            className="flex-fill overflow-hidden"
            headerHeight={GRID_HEADER_HEIGHT[1]}
            columnDefs={columnDefs}
            rowData={total}
            onRowNodeId={(params) => params.pkgSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default ArticlePackageAgGrid;
