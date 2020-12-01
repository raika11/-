import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { useDispatch } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';

import { MokaTableImageRenderer } from '@components';
import { columnDefs, rowClassRules } from './DeskingWorkAgGridColumns';
import DeskingReadyGrid from './DeskingReadyGrid';
import DeskingEditorRenderer from './DeskingEditorRenderer';
import { unescapeHtml } from '@utils/convertUtil';
import toast from '@utils/toastUtil';
import { putDeskingWorkListSort } from '@store/desking';
import { findWork, makeHoverBox, getRow, getRowIndex, getMoveMode, clearHoverStyle, clearNextStyle, clearWorkStyle, findNextMainRow, addNextRowStyle } from '@utils/agGridUtil';

let hoverBox = makeHoverBox();

/**
 * 데스킹 AgGrid
 */
const DeskingWorkAgGrid = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, onRowClicked, onSave, onDelete } = props;
    const { deskingWorks } = component;
    const dispatch = useDispatch();

    // state
    const [rowData, setRowData] = useState([]);
    const [gridInstance, setGridInstance] = useState(null);
    const [hoverNode, setHoverNode] = useState(null);
    const [nextNode, setNextNode] = useState(null);
    const [draggingNodeData, setDraggingNodeData] = useState(null);

    useEffect(() => {
        if (!deskingWorks) return;
        if (component?.viewYn === 'N') return;

        setRowData(
            deskingWorks.map((desking) => {
                // 제목 replace
                let escapeTitle = desking.title;
                if (escapeTitle && escapeTitle !== '') escapeTitle = unescapeHtml(escapeTitle);

                return {
                    ...desking,
                    gridType: 'DESKING',
                    componentWorkSeq: component.seq,
                    title: escapeTitle,
                    contentOrdEx: desking.rel ? '' : `0${desking.contentOrd}`.substr(-2),
                    relOrdEx: desking.rel ? `0${desking.relOrd}`.substr(-2) : '',
                    onRowClicked,
                    onSave,
                    onDelete,
                };
            }),
        );
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
     * 주기사 셀렉 시 관련기사 자동 셀렉
     */
    const handleRowSelected = useCallback((params) => {
        if (params.node.data.rel) return;
        let selectedMain = params.api.getSelectedNodes().filter((node) => !node.data.rel);
        let contentIds = selectedMain.map((node) => node.data.contentId);
        params.api.forEachNode((node) => {
            // 관련기사 selected 상태 변경
            if (node.data.rel) {
                node.setSelected(params.node.selected && contentIds.includes(node.data.parentContentId));
            }
        });
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
     */
    const appendRelRows = useCallback(
        (api, type, draggingNode, overNode) => {
            let moveForward = draggingNode.childIndex > overNode.childIndex;
            let forwardNode = moveForward ? overNode : draggingNode;
            let backwardNode = moveForward ? draggingNode : overNode;

            // display 기준으로 새로운 rows생성
            let displayedRows = [],
                result = [];
            for (let i = 0; i < api.getDisplayedRowCount(); i++) {
                displayedRows.push(api.getDisplayedRowAtIndex(i).data);
            }

            if (type === 'mainToMain') {
                let selected = api.getSelectedNodes();
                let contentOrd = overNode.data.contentOrd - 1;
                for (let i = 0; i < selected.length; i++) {
                    if (!selected[i].data.rel) {
                        contentOrd++;
                    }
                    displayedRows.forEach((a) => {
                        if (a.contentId === selected[i].data.contentId) {
                            a.contentOrd = contentOrd;
                        }
                    });
                }

                // 정렬
                result = displayedRows.sort(function (a, b) {
                    if (a.contentOrd === b.contentOrd) {
                        if (selected.map((node) => node.data.contentId).includes(b.contentId)) {
                            return -1;
                        } else {
                            return a.relOrd - b.relOrd;
                        }
                    } else {
                        return a.contentOrd - b.contentOrd;
                    }
                });

                // 순번 재지정
                contentOrd = 0;
                result.forEach((node) => {
                    if (!node.rel) {
                        contentOrd++;
                    }
                    node.contentOrd = contentOrd;
                });
            } else if (type === 'relToRel') {
                // draggingNode와 overNode의 relOrd 변경
                let firstArr = displayedRows.splice(0, forwardNode.childIndex);
                let secondArr = displayedRows.splice(0, 1); // forwardNode + 관련기사
                let thirdArr = displayedRows.splice(0, backwardNode.childIndex - firstArr.length - secondArr.length);
                let fourthArr = displayedRows.splice(0, 1); // backwardNode + 관련기사
                let lastArr = displayedRows;

                secondArr = secondArr.map((node) => ({
                    ...node,
                    relOrd: backwardNode.data.relOrd,
                    relOrdEx: `0${backwardNode.data.relOrd}`.substr(-2),
                }));
                fourthArr = fourthArr.map((node) => ({
                    ...node,
                    relOrd: forwardNode.data.relOrd,
                    relOrdEx: `0${forwardNode.data.relOrd}`.substr(-2),
                }));

                // 순서 변경 (2번이 4번 자리로 감)
                result = firstArr.concat(thirdArr).concat(fourthArr).concat(secondArr).concat(lastArr);
            } else if (type === 'relToMain') {
                let firstArr = displayedRows.splice(0, forwardNode.childIndex);
                let secondArr = displayedRows.splice(0, 1); // forwardNode(주기사 1건)
                let thirdArr = displayedRows.splice(0, backwardNode.childIndex - firstArr.length - secondArr.length); // 가운데 관련기사
                let fourthArr = displayedRows.splice(0, 1); // backwardNode(교체하는 관련기사 1건)
                let fifthArr = displayedRows.splice(0, forwardNode.data.relSeqs.length - thirdArr.length - fourthArr.length); // 남은 관련기사
                let lastArr = displayedRows;

                secondArr = secondArr.map((node) => ({
                    ...node,
                    parentContentId: backwardNode.data.contentId,
                    rel: true,
                    relOrd: backwardNode.data.relOrd,
                    relSeqs: null,
                }));
                thirdArr = thirdArr.map((node) => ({
                    ...node,
                    parentContentId: backwardNode.data.contentId,
                }));
                fifthArr = fifthArr.map((node) => ({
                    ...node,
                    parentContentId: backwardNode.data.contentId,
                }));
                fourthArr = fourthArr.map((node) => ({
                    ...node,
                    parentContentId: null,
                    rel: false,
                    relOrd: 1,
                    contentOrd: forwardNode.data.contentOrd,
                    relSeqs: secondArr
                        .concat(thirdArr)
                        .concat(fifthArr)
                        .map((a) => a.seq),
                }));

                // 순서 변경 (2 <-> 4)
                result = firstArr.concat(fourthArr).concat(thirdArr).concat(secondArr).concat(fifthArr).concat(lastArr);
            }

            // api.setRowData([]);
            setDraggingNodeData(draggingNode.data);
            dispatch(
                putDeskingWorkListSort({
                    componentWorkSeq: component.seq,
                    datasetSeq: component.datasetSeq,
                    list: result,
                }),
            );
        },
        [component.datasetSeq, component.seq, dispatch],
    );

    /**
     * 드래그 move
     * 이동 가능) 주기사의 관련기사 <=> 관련기사, 주기사 <=> 주기사, 관련기사 => 주기사
     * 이동 불가) 주기사 => 본인 관련기사, 주기사 => 타 관련기사, 관련기사 => 타 주기사, 관련기사 <=> 타 관련기사
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
                // 관련기사 드래그)
                if (overNodeData.parentContentId === params.node.data.parentContentId) {
                    draggingNode.classList.add('hover');
                } else if (overNodeData.contentId === params.node.data.parentContentId) {
                    draggingNode.classList.add('change');
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
            clearHoverStyle(hoverNode);
            clearNextStyle(nextNode);
            const workElement = findWork(params.api.gridOptionsWrapper.layoutElements[0]);
            if (!workElement) return null;
            if (workElement.classList.contains('disabled')) return null;
            workElement.removeChild(hoverBox);
            clearWorkStyle(workElement);
        },
        [hoverNode, nextNode],
    );

    /**
     * 드래그 종료
     */
    const handleRowDragEnd = useCallback(
        (params) => {
            const draggingNode = params.node;
            let overNode = params.api.getDisplayedRowAtIndex(getRowIndex(params.event));
            const sameNode = draggingNode === overNode;

            handleRowDragLeave(params);

            if (sameNode) return;

            let rollback = true,
                type = '';

            if (draggingNode.data.rel) {
                // 관련기사인 경우 (같은 주기사 내, 주기사 <=> 관련기사 교체)
                if (overNode.data.parentContentId === draggingNode.data.parentContentId) {
                    rollback = false;
                    type = 'relToRel';
                } else if (overNode.data.contentId === draggingNode.data.parentContentId) {
                    rollback = false;
                    type = 'relToMain';
                }
            } else {
                // 주기사인 경우 (주기사끼리만 이동가능)
                if (getMoveMode(draggingNode)) {
                    if (overNode.data.rel) {
                        const maybeSame = params.api.getRowNode(overNode.data.parentContentId);
                        if (draggingNode.data.contentId !== maybeSame.data.contentId) {
                            rollback = false;
                            type = 'mainToMain';
                            overNode = maybeSame;
                        }
                    } else if (draggingNode.data.contentId !== overNode.data.contentId) {
                        rollback = false;
                        type = 'mainToMain';
                    }
                }
            }

            if (rollback) {
                toast.warning('이동할 수 없습니다');
                params.api.deselectAll();
                return;
            }

            appendRelRows(params.api, type, draggingNode, overNode);
            params.api.deselectAll();
        },
        [appendRelRows, handleRowDragLeave],
    );

    /**
     * row data 업데이트 후 실행
     */
    const handleRowDataUpdated = useCallback(
        (params) => {
            if (draggingNodeData) {
                let arr = [];
                params.api.forEachNode((node) => {
                    if (node.data.contentId === draggingNodeData.contentId || node.data.parentContentId === draggingNodeData.contentId) {
                        arr.push(node);
                    }
                });
                params.api.redrawRows({ rowNodes: arr });
                params.api.resetRowHeights();
                setHoverNode(null);
                setNextNode(null);
                setDraggingNodeData(null);
            }

            // params.api.refreshCells({ force: true, columns: ['relOrdEx', 'relTitle', 'contentOrdEx', 'title', 'thumbFileName'] });
        },
        [draggingNodeData],
    );

    /**
     * row height 제어 (관련기사는 height가 작음)
     * @param {object} params ag-grid instance
     */
    const getRowHeight = useCallback((params) => {
        return params.data.rel ? 42 : 53;
    }, []);

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
                rowDragManaged={false}
                animateRows
                enableMultiRowDragging
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                suppressHorizontalScroll
                onCellClicked={handleCellClicked}
                onRowDataUpdated={handleRowDataUpdated}
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
