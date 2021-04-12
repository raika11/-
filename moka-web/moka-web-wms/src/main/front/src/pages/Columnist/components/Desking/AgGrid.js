import React, { useCallback, useEffect, useState } from 'react';
import { JPLUS_REP_DIV_DEFAULT, CHANNEL_TYPE } from '@/constants';
import { addDeskingWorkDropzone } from '@utils/deskingUtil';
import { MokaTable } from '@components';
import columnDefs from './AgGridColumns';

/**
 * 페이지편집 > 칼럼니스트 > AgGrid
 */
const AgGrid = (props) => {
    const { search, list, total, loading, onChangeSearchOption, onDragStop, dropTargetAgGrid } = props;
    const [rowData, setRowData] = useState([]);
    const [gridInstance, setGridInstance] = useState(null);

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((list) => {}, []);

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                channelType: CHANNEL_TYPE.C.code,
                repSeqText: l.repSeq || '   -',
                jplusRepDiv: l.repSeq ? (l.jplusRepDiv || JPLUS_REP_DIV_DEFAULT).slice(0, 2) : '   -',
            })),
        );
    }, [list]);

    useEffect(() => {
        // 드롭 타겟 ag-grid에 drop-zone 설정
        if (gridInstance) {
            if (Array.isArray(dropTargetAgGrid)) {
                // 타겟이 리스트인 경우
                dropTargetAgGrid.forEach((targetGrid, agGridIndex) => {
                    addDeskingWorkDropzone(onDragStop, gridInstance, targetGrid, agGridIndex);
                });
            } else {
                // 타겟이 1개인 경우
                addDeskingWorkDropzone(onDragStop, gridInstance, dropTargetAgGrid);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropTargetAgGrid, gridInstance, onDragStop]);

    return (
        <React.Fragment>
            <MokaTable
                className="overflow-hidden flex-fill"
                setGridInstance={setGridInstance}
                columnDefs={columnDefs}
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
