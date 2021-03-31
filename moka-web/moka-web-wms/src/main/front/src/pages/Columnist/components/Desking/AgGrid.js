import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import columnDefs from './AgGridColumns';

/**
 * 페이지편집 > 칼럼니스트 > AgGrid
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
                repSeqText: l.repSeq || '   -',
                inoutText: l.inout === 'O' ? '외부 필진' : '내부 필진',
            })),
        );
    }, [list]);

    return (
        <React.Fragment>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowHeight={45}
                rowData={rowData}
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
