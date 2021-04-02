import React, { useState, forwardRef, useEffect } from 'react';
import { MokaTable } from '@components';
import columnDefs from './AgGridColumns';

/**
 * 홈 섹션편집 > 패키지 목록 > AgGrid
 */
const AgGrid = forwardRef((props, ref) => {
    const { search, list, total, loading, onDragStop, dropTargetAgGrid, onChangeSearchOption } = props;

    // state
    const [gridInstance, setGridInstance] = useState(null);
    // const [modalShow, setModalShow] = useState(false);
    // const [selected, setSelected] = useState({});

    /**
     * row 클릭
     * @param {object} data data
     * @param {object} params 클릭시 aggrid에서 넘겨주는 데이터
     */
    const handleRowClicked = (data, params) => {};

    // useEffect(() => {
    //     // 드롭 타겟 ag-grid에 drop-zone 설정
    //     if (gridInstance) {
    //         if (Array.isArray(dropTargetAgGrid)) {
    //             // 타겟이 리스트인 경우
    //             dropTargetAgGrid.forEach((targetGrid, agGridIndex) => {
    //                 addDeskingWorkDropzone(onDragStop, gridInstance, targetGrid, agGridIndex);
    //             });
    //         } else {
    //             // 타겟이 1개인 경우
    //             addDeskingWorkDropzone(onDragStop, gridInstance, dropTargetAgGrid);
    //         }
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [dropTargetAgGrid, gridInstance, onDragStop]);

    return (
        <React.Fragment>
            <MokaTable
                ref={ref}
                className="overflow-hidden flex-fill"
                setGridInstance={setGridInstance}
                columnDefs={columnDefs}
                rowData={list}
                onRowNodeId={(pkg) => pkg.pkgSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={onChangeSearchOption}
            />
        </React.Fragment>
    );
});

export default AgGrid;
