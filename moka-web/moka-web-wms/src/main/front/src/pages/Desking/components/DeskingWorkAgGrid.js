import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { AgGridReact } from 'ag-grid-react';

import { MokaTableImageRenderer } from '@components';
import { columnDefs, rowClassRules } from './DeskingWorkAgGridColumns';
import DeskingReadyGrid from './DeskingReadyGrid';
import DeskingEditorRenderer from './DeskingEditorRenderer';
import { unescapeHtml } from '@utils/convertUtil';
import toast from '@utils/toastUtil';
import { findWork, makeHoverBox, getRow, getMoveMode, clearHoverStyle, clearNextStyle, clearWorkStyle, findNextMainRow, addNextRowStyle } from '@utils/agGridUtil';

let hoverBox = makeHoverBox();

/**
 * 데스킹 AgGrid
 */
const DeskingWorkAgGrid = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, onRowClicked, onSave, onDelete } = props;
    const { deskingWorks } = component;

    // state
    const [rowData, setRowData] = useState([]);
    const [gridInstance, setGridInstance] = useState(null);
    const [hoverNode, setHoverNode] = useState(null);
    const [nextNode, setNextNode] = useState(null);
    const [relRows, setRelRows] = useState([]);

    useEffect(() => {
        if (deskingWorks) {
            if (component.viewYn === 'Y') {
                setRowData(
                    deskingWorks.map((desking) => {
                        // 제목 replace
                        let escapeTitle = desking.title;
                        if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                        return {
                            ...desking,
                            gridType: 'DESKING',
                            componentWorkSeq: component.seq,
                            title: desking.rel ? '' : escapeTitle,
                            relTitle: desking.rel ? escapeTitle : '',
                            contentOrdEx: desking.rel ? '' : `0${desking.contentOrd}`.substr(-2),
                            relOrdEx: desking.rel ? `0${desking.relOrd}`.substr(-2) : '',
                            onRowClicked,
                            onSave,
                            onDelete,
                        };
                    }),
                );
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [component.seq, deskingWorks]);

    /**
     * ag-grid onGridReady
     * @param {object} params onGridReady params
     */
    const handleGridReady = (params) => {
        setComponentAgGridInstances(
            produce(componentAgGridInstances, (draft) => {
                draft[agGridIndex] = params;
            }),
        );
        setGridInstance(params);
    };

    /**
     * cell별 설정에 따라서 RowClick 호출
     * @param {object} params ag-grid data
     */
    const handleCellClicked = useCallback(
        (params) => {
            if (params.colDef.field === 'title' || params.colDef.field === 'relTitle') return;
            onRowClicked(params.node.data, params);
        },
        [onRowClicked],
    );

    /**
     * row selected
     */
    const handleRowSelected = useCallback((params) => {
        if (params.node.data.rel) return;
        let selectedMain = params.api.getSelectedNodes().filter((node) => !node.data.rel);
        let contentIds = selectedMain.map((node) => node.data.contentId);
        let rr = [];
        params.api.forEachNode((node) => {
            // 관련기사 selected 상태 변경
            if (node.data.rel) {
                node.setSelected(params.node.selected && contentIds.includes(node.data.parentContentId));
                rr.push(node);
            }
        });
        setRelRows(rr);
    }, []);

    /**
     * 드래그 시작
     */
    const handleRowDragEnter = useCallback((params) => {
        const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
        if (!workElement) return null;
        if (workElement.classList.contains('disabled')) return null;
        workElement.appendChild(hoverBox);

        let selected = params.api.getSelectedNodes();
        if (selected.length < 1 && params.node) {
            // select된 노드가 없는데 드래그 중인 노드가 있으면
            params.node.setSelected(true);
        } else if (!selected.map((node) => node.data.contentId).includes(params.node.data.contentId)) {
            // select된 노드에 드래그 중인 노드가 포함이 안되어있으면
            params.node.setSelected(true);
        }
    }, []);

    /**
     * 관련기사 추가
     * @param {object} api
     * @param {object} movingData
     */
    const appendRelRows = useCallback(
        (api, movingData) => {
            // display 기준으로 새로운 rows생성
            let displayedRows = [];
            for (let i = 0; i < api.getDisplayedRowCount(); i++) {
                displayedRows.push(api.getDisplayedRowAtIndex(i).data);
            }
            // 작업중
            let toIndex = displayedRows.indexOf(movingData) + 1; // 이동하는 노드의 아래에 넣는다.
            for (let i = 0; i < relRows.length; i++) {
                displayedRows.splice(toIndex + i, 0, relRows[i]);
            }

            api.setRowData(displayedRows);
            setRelRows([]);
        },
        [relRows],
    );

    /**
     * 드래그 move
     * 주기사의 관련기사 <=> 관련기사 이동 가능
     * 주기사 <=> 주기사 이동 가능
     * 주기사 => 타 관련기사 불가, 관련기사 => 타 주기사 불가, 관련기사 <=> 타 관련기사 불가
     */
    const handleDragMove = useCallback(
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

            if (params.node.data.rel) {
                // 관련기사 드래그
                if (overNodeData.parentContentId === params.node.data.parentContentId) {
                    draggingNode.classList.add('hover');
                } else if (overNodeData.contentId === params.node.data.parentContentId) {
                    draggingNode.classList.add('hover');
                }
            } else {
                // 주기사 드래그
                if (!overNodeData.rel && (!overNodeData.relSeqs || overNodeData.relSeqs.length < 1)) {
                    draggingNode.classList.add('hover');
                } else {
                    const nextRow = findNextMainRow(draggingNode);
                    addNextRowStyle(nextRow);
                    nextRow.node && setNextNode(nextRow.node);
                }
            }
        },
        [hoverNode, nextNode],
    );

    /**
     * 드래그 leave
     */
    const handleRowDragLeave = useCallback(
        (params) => {
            const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
            if (!workElement) return null;
            if (workElement.classList.contains('disabled')) return null;

            workElement.removeChild(hoverBox);
            clearWorkStyle(workElement);
            clearHoverStyle(hoverNode);
            clearNextStyle(nextNode);
        },
        [hoverNode, nextNode],
    );

    /**
     * 드래그 종료
     */
    const handleRowDragEnd = useCallback(
        (params) => {
            const draggingNode = params.node;
            const overNode = params.overNode;
            const sameNode = draggingNode === overNode;
            let rollback = true;

            if (!sameNode && getMoveMode(draggingNode)) {
                if (draggingNode.data.rel) {
                    // 관련기사인 경우 (같은 주기사 내에서만 이동가능)
                    if (overNode.data.parentContentId === draggingNode.data.parentContentId) {
                        rollback = false;
                    }
                } else {
                    // 주기사인 경우 (주기사끼리만 이동가능)
                    if (!overNode.data.rel && draggingNode.data.contentId !== overNode.data.contentId) {
                        rollback = false;
                    }
                }
            }

            if (rollback) {
                toast.warning('이동할 수 없습니다');
            } else if (draggingNode.data.relSeqs && draggingNode.data.relSeqs.length > 0) {
                appendRelRows(params.api, draggingNode.data);
            }

            params.api.deselectAll();
            handleRowDragLeave(params);
        },
        [appendRelRows, handleRowDragLeave],
    );

    /**
     * row height 제어 (관련기사는 height가 작음)
     * @param {object} params ag-grid instance
     */
    const getRowHeight = useCallback((params) => {
        return params.data.rel ? 42 : 53;
    }, []);

    useEffect(() => {
        if (gridInstance) {
            gridInstance.api.refreshCells({ force: true, columns: ['relOrdEx', 'relTitle', 'contentOrdEx', 'title', 'thumbFileName'] });
        }
    }, [rowData, gridInstance]);

    return (
        <div className="ag-theme-moka-desking-grid px-1">
            <AgGridReact
                immutableData
                onGridReady={handleGridReady}
                rowData={rowData}
                getRowNodeId={(params) => params.contentId}
                columnDefs={columnDefs}
                localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                onRowDragEnter={handleRowDragEnter}
                onRowDragEnd={handleRowDragEnd}
                onRowDragMove={handleDragMove}
                onRowDragLeave={handleRowDragLeave}
                onRowSelected={handleRowSelected}
                rowSelection="multiple"
                rowDragManaged
                animateRows
                enableMultiRowDragging
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                suppressHorizontalScroll
                onCellClicked={handleCellClicked}
                headerHeight={0}
                rowClassRules={rowClassRules}
                getRowHeight={getRowHeight}
                frameworkComponents={{ imageRenderer: MokaTableImageRenderer, editor: DeskingEditorRenderer }}
            />
            {componentAgGridInstances[agGridIndex] && <DeskingReadyGrid componentAgGridInstances={componentAgGridInstances} agGridIndex={agGridIndex} component={component} />}
        </div>
    );
};

export default DeskingWorkAgGrid;
