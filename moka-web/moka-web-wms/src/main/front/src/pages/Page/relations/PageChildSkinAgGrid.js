import React, { useState, useCallback } from 'react';
import { columnDefs, rowData } from '@/pages/commons/LookupContainerListColumns';
import { MokaTable } from '@components';

/**
 * 관련 본문스킨 AgGrid 목록
 */
const PageChildSkinAgGrid = (props) => {
    const [total] = useState(rowData.length);
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
            columnDefs={columnDefs}
            rowData={rowData}
            getRowNodeId={(params) => params.containerSeq}
            agGridHeight={550}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['append', 'link']}
        />
    );
};

export default PageChildSkinAgGrid;
