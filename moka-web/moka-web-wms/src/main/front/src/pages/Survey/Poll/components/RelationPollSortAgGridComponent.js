import React, { useEffect, useState } from 'react';
import { MokaTable } from '@components';
import commonUtil from '@utils/commonUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
import { columnDefs } from '@pages/Survey/Poll/components/RelationPollSortAgGridColumns';

function areEqual(prevProps, nextProps) {
    let areEqual = false;
    if (!commonUtil.isEmpty(prevProps.rows) && !commonUtil.isEmpty(nextProps.rows)) {
        if (prevProps.rows.length === nextProps.rows.length) {
            areEqual = true;
        }
    }
    return areEqual;
}

/**
 * 관련 투표 AgGrid
 */
const RelationPollSortAgGridComponent = ({ rows, onChange, onDelete }) => {
    const [rowData, setRowData] = useState([]);
    const [instance, setInstance] = useState(null);

    /**
     * 드래그 종료
     */
    const handleDragEnd = (params) => {
        const api = params.api;
        const displayedRows = getDisplayedRows(api).map((d, i) => ({
            ...d,
            item: {
                ...d.item,
                ordNo: i + 1,
            },
        }));
        api.setRowData(displayedRows);

        //console.log(displayedRows);
        //api.applyTransaction({ update: displayedRows });

        if (onChange instanceof Function) {
            onChange(displayedRows.map((displayedRow) => displayedRow.item));
        }
    };

    useEffect(() => {
        // 스토어가 변경 되면 grid 리스트를 업데이트
        if (!commonUtil.isEmpty(rows) && rows instanceof Array) {
            if (instance) {
                instance.api.setRowData([]);
            }
            setRowData(
                rows.map((row, index) => ({
                    item: {
                        ...row,
                        ordNo: index + 1,
                    },
                    onDelete,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    return (
        <MokaTable
            rowData={rowData}
            rowHeight={46}
            setGridInstance={setInstance}
            onRowDragEnd={handleDragEnd}
            onRowNodeId={(params) => params.item.ordNo}
            columnDefs={columnDefs}
            localeText={{ noRowsToShow: '관련투표가 없습니다', loadingOoo: '조회 중입니다' }}
            dragStyle
            animateRows
            suppressRowClickSelection
            suppressMoveWhenRowDragging
            rowDragManaged
            header={false}
            paging={false}
        />
    );
};

export default React.memo(RelationPollSortAgGridComponent, areEqual);
