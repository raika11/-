import React, { useCallback, useEffect, useState } from 'react';
import { JPLUS_REP_DIV_DEFAULT } from '@/constants';
import { MokaTable } from '@components';
import columnDefs from './AgGridColumns';

/**
 * 페이지편집 > 기자 목록 > AgGrid
 */
const AgGrid = (props) => {
    const { search, list, total, loading, onChangeSearchOption } = props;
    const [rowData, setRowData] = useState([]);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((list) => {}, []);

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                jplusRepDivNm: (l.jplusRepDivNm || JPLUS_REP_DIV_DEFAULT).slice(0, 2),
            })),
        );
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            rowHeight={45}
            onRowNodeId={(reporter) => reporter.repSeq}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            preventRowClickCell={['reporterPage']}
            onChangeSearchOption={onChangeSearchOption}
        />
    );
};

export default AgGrid;
