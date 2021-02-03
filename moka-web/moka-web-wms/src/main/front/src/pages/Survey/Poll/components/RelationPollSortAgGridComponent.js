import React, { useEffect, useState } from 'react';
import commonUtil from '@utils/commonUtil';
import { AgGridReact } from 'ag-grid-react';
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

const RelationPollSortAgGridComponent = ({ rows, onChange, onDelete }) => {
    const [rowData, setRowData] = useState([]);
    const [instance, setInstance] = useState(null);

    const onGridReady = (params) => {
        setInstance(params);
    };

    const handleDragEnd = (params) => {
        const api = params.api;

        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            const update = { ...data, item: { ...data.item, ordNo: i + 1 } };
            displayedRows.push(update);
            /*displayedRows.push(data);*/
        }
        //console.log(displayedRows);
        //api.applyTransaction({ update: displayedRows });
        setTimeout(() => {
            api.setRowData(displayedRows);
        }, 100);

        if (onChange instanceof Function) {
            onChange(displayedRows.map((displayedRow) => displayedRow.item));
        }
    };

    // 스토어가 변경 되면 grid 리스트를 업데이트.
    useEffect(() => {
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
        <>
            <div className="ag-theme-moka-dnd-grid w-100">
                <AgGridReact
                    immutableData
                    onGridReady={onGridReady}
                    rowData={rowData}
                    getRowNodeId={(params) => {
                        return params.item.ordNo;
                    }}
                    columnDefs={columnDefs}
                    localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                    onRowDragEnd={handleDragEnd}
                    animateRows
                    rowDragManaged
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                    headerHeight={0}
                />
            </div>
        </>
    );
};

export default React.memo(RelationPollSortAgGridComponent, areEqual);
