import React, { useCallback } from 'react';
import { MokaTable } from '@components';
import columnDefs from './AgGridColumns';

/**
 * 페이지편집 > 칼럼니스트 > AgGrid
 */
const AgGrid = (props) => {
    const { search, list, total, loading, onChangeSearchOption } = props;

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((list) => {}, []);

    return (
        <React.Fragment>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(data) => data.seqNo}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={onChangeSearchOption}
                dragManaged={false}
                animateRows={false}
            />
        </React.Fragment>
    );
};

export default AgGrid;
