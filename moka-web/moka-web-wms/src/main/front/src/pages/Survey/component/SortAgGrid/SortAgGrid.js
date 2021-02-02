import React, { useState, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from './SortAgGridColumns';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import useDebounce from '@hooks/useDebounce';

const SortAgGrid = ({ rows, onChange, onDelete, onSetData }) => {
    const [rowData, setRowData] = useState([]);
    const [changeArticle, setChangeArticle] = useState(null);
    const [instance, setInstance] = useState(null);

    // 그리드 옵션, 드래그핼때 필요함.
    const onGridReady = (params) => {
        setInstance(params);
    };

    // 드래그 가 끝났을떄.
    const handleDragEnd = (params) => {
        const api = params.api;
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            const update = produce(data, (draft) => {
                draft.item.ordNo = i + 1;
            });
            displayedRows.push(update);
        }
        api.applyTransaction({ update: displayedRows });
        if (onChange instanceof Function) {
            onChange(displayedRows.map((displayedRow) => displayedRow.item));
        }
    };

    const handleChangeValue = (row) => {
        setChangeArticle(row);
    };
    const handleDebounceChangeValue = useDebounce(handleChangeValue);

    // 스토어가 변경 되면 grid 리스트를 업데이트.
    useEffect(() => {
        if (!commonUtil.isEmpty(rows) && rows instanceof Array) {
            setRowData(
                rows.map((row, index) => ({
                    item: {
                        ...row,
                        ordNo: index + 1,
                    },
                    onDelete,
                    onChange: handleDebounceChangeValue,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    useEffect(() => {
        if (!commonUtil.isEmpty(changeArticle)) {
            console.log(changeArticle);
            const index = changeArticle.ordNo - 1;
            setRowData(
                produce(rowData, (draft) => {
                    draft[index].item = { ...changeArticle, update: true };
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changeArticle]);

    useEffect(() => {
        console.log(rowData);
    }, [rowData]);

    return (
        <>
            <div className="ag-theme-moka-dnd-grid w-100">
                <AgGridReact
                    immutableData
                    onGridReady={onGridReady}
                    rowData={rowData}
                    getRowNodeId={(params) => params.item.ordNo}
                    columnDefs={columnDefs}
                    localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                    onRowDragEnd={handleDragEnd}
                    animateRows
                    rowDragManaged
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                    headerHeight={0}
                    rowHeight={100}
                />
            </div>
        </>
    );
};

export default SortAgGrid;
