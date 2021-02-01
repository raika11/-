import React, { useState, useCallback, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { getRow } from '@utils/agGridUtil';
import { findWork, makeHoverBox, findNextMainRow } from '@utils/deskingUtil';
import { columnDefs, rowClassRules } from './SortAgGridColumns';
import commonUtil from '@utils/commonUtil';

const hoverCssName = 'hover';
const nextCssName = 'next';

let hoverBox = makeHoverBox();
// 드래그 완료시 타겟 css 처리. ( 초기화. )
const clearNextStyle = (node) => {
    if (node) {
        node.classList.remove(nextCssName);
        node.classList.remove(hoverCssName);
    }
};

// 드래그 완료시 타겟 css 처리. ( 초기화. )
const clearHoverStyle = (node) => {
    if (node) {
        node.classList.remove(hoverCssName);
        node.classList.remove('ag-row-hover');
        node.classList.remove('change');
    }
};

// 드래그시 타겟 css 변경 처리.
const addNextRowStyle = (nextRow) => {
    if (nextRow.type === 'none') return;
    if (nextRow.type === nextCssName) {
        nextRow.node.classList.add(nextCssName);
    } else if (nextRow.type === 'last') {
        nextRow.node.classList.remove(hoverCssName);
        nextRow.node.classList.add(nextCssName);
    } else if (nextRow.type === 'last-rel') {
        nextRow.node.classList.add(hoverCssName);
    }
};

const SortAgGrid = ({ rows, onChange, onDelete }) => {
    const [rowData, setRowData] = useState([]);
    const [, setGridInstance] = useState(null);
    const [hoverNode, setHoverNode] = useState(null);
    const [nextNode, setNextNode] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    // 그리드 옵션, 드래그핼때 필요함.
    const onGridReady = (params) => {
        setGridInstance(params);
    };

    // 드래그 시작.
    const onRowDragEnter = useCallback((params) => {
        const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
        if (!workElement) return null;
        if (workElement.classList.contains('disabled')) return null;
        workElement.appendChild(hoverBox);
        params.node.setSelected(true);
    }, []);

    // 드래그 가 끝났을떄.
    const onRowDragEnd = useCallback(
        (params) => {
            clearHoverStyle(hoverNode);
            clearNextStyle(nextNode);
            // findWork(params.api.gridOptionsWrapper.layoutElements[0]).removeChild(hoverBox);

            const paramsNode = params.node;
            const paramsOverNode = params.overNode;

            // 위치변경 이벤트가 발생 하면 실제 데이터를 재배열 해준다.
            let tempRowData = rowData.map((e) => e);
            let tmp = tempRowData[paramsOverNode.data.dataIndex];
            tempRowData[paramsOverNode.data.dataIndex] = tempRowData[paramsNode.data.dataIndex];
            tempRowData[paramsNode.data.dataIndex] = tmp;

            setIsUpdate(true);
            setRowData(tempRowData);
        },
        [hoverNode, nextNode, rowData],
    );

    // 드래그 이벤트 중일때. css 로 변경중 처리를 하기 위해.
    const onRowDragMove = useCallback(
        (params) => {
            const draggingNode = getRow(params.event);
            if (!draggingNode) return;

            const draggingIdx = draggingNode.getAttribute('row-index');
            const overNodeData = params.overNode.data;
            setHoverNode(draggingNode);

            if (hoverNode && hoverNode.getAttribute('row-index') !== draggingIdx) {
                clearHoverStyle(hoverNode);
                clearNextStyle(nextNode);
            }

            if (!overNodeData.rel && (!overNodeData.relSeqs || overNodeData.relSeqs.length < 1)) {
                draggingNode.classList.add(hoverCssName);
            } else {
                const nextRow = findNextMainRow(draggingNode);
                addNextRowStyle(nextRow);
                nextRow.node && setNextNode(nextRow.node);
            }
        },
        [hoverNode, nextNode],
    );

    // 그리드 위치가 변경 되고 state 에 순서가 현재랑 다를 경우만 store 의 리스트도 같이 변경 해준다. ( 저장 할때 변경된 순서로 api 호출.)
    const handleRowDataUpdated = useCallback(
        (params) => {
            // 순서가 변경 되었을 경우에.
            // 스토어 temp리스트(hotClickTempList) 와 현재 리스트 스테이트(rowData) 리스트가
            // 다를 경우만 store temp 리스트를 업데이트 하기.

            /*console.log(rowData);*/
            /*rowData.map((e) => {
                /!*return { totalId: e.totalId, title: e.item.title, url: e.item.url };*!/
                console.log(e);
            });*/

            /*if (onChange instanceof Function) {
                onChange(
                    rowData.map((row) => ({
                        ...row.item,
                    })),
                );
            }*/

            if (isUpdate) {
                setTimeout(() => {
                    params.api.refreshCells({ force: true });
                    if (onChange instanceof Function) {
                        onChange(
                            rowData.map((row) => ({
                                ...row.item,
                            })),
                        );
                    }
                    setIsUpdate(false);
                }, 100);
            }
        },
        [isUpdate, onChange, rowData],
    );

    // 스토어가 변경 되면 grid 리스트를 업데이트.
    useEffect(() => {
        if (!commonUtil.isEmpty(rows) && rows instanceof Array) {
            setRowData(
                rows.map((row, index) => ({
                    dataIndex: index,
                    totalId: row.seqNo,
                    title: row.title,
                    item: {
                        ...row,
                    },
                    onDelete,
                })),
            );
        }
    }, [onDelete, rows]);

    return (
        <>
            <div className="ag-theme-moka-desking-grid bulk-hot-click w-100">
                <AgGridReact
                    immutableData
                    onGridReady={onGridReady}
                    rowData={rowData}
                    getRowNodeId={(params) => params.totalId}
                    columnDefs={columnDefs}
                    localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                    onRowDragEnter={onRowDragEnter}
                    onRowDragEnd={onRowDragEnd}
                    onRowDragMove={onRowDragMove}
                    rowSelection="multiple"
                    animateRows={true}
                    rowDragManaged={true}
                    enableMultiRowDragging
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                    suppressHorizontalScroll
                    onRowDataUpdated={handleRowDataUpdated}
                    headerHeight={0}
                    rowClassRules={rowClassRules}
                    rowHeight={100}
                />
            </div>
        </>
    );
};

export default SortAgGrid;
