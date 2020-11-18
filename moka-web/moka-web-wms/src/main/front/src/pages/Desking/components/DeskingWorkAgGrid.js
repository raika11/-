import React, { useState, useEffect } from 'react';
import produce from 'immer';
import { AgGridReact } from 'ag-grid-react';
import { unescapeHtml } from '@utils/convertUtil';
import { MokaTableImageRenderer } from '@components';
import { columnDefs, rowClassRules } from './DeskingWorkAgGridColumns';
import DeskingReadyGrid from './DeskingReadyGrid';

/**
 * 데스킹 AgGrid
 */
const DeskingWorkAgGrid = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances } = props;
    const { deskingWorks } = component;
    // const [moveRows, setMoveRows] = useState([]);

    // local state
    const [gridInstance, setGridInstance] = useState(null);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        if (deskingWorks) {
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
                    };
                }),
            );
        }
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

    // // 드래그 시작
    // const onRowDragEnter = (params) => {
    //     const data = params.node.data;
    //     let fromIndex = deskingWorks.indexOf(data);

    //     // 관련기사 삭제
    //     if (data.relSeqs && data.relSeqs.length > 0) {
    //         setMoveRows(deskingWorks.slice(fromIndex + 1, fromIndex + 1 + data.relSeqs.length));
    //         let newRowData = deskingWorks.filter((node) => !data.relSeqs.includes(node.seq));
    //         params.api.setRowData(newRowData);
    //         // } else {
    //         //     setMoveRows(deskingWorks.slice(fromIndex, fromIndex));
    //     }
    // };

    // // 드래그의 의미
    // const getMoveMode = (movingData, overData) => {
    //     if (!!!movingData.rel) {
    //         if (movingData.relSeqs && movingData.relSeqs.includes(overData.seq)) {
    //             return 'FamillyParentToChild'; // 주기사 -> 관련기사(부모가 자식으로 변경): trade
    //         } else {
    //             if (!!!overData.rel) {
    //                 return 'ParentToParent'; // 주기사 -> 타 주기사: drag
    //             } else {
    //                 return 'ParentToChild'; // 주기사 -> 타 관련기사: rollback
    //             }
    //         }
    //     } else if (!!!overData.rel) {
    //         if (overData.relSeqs && overData.relSeqs.includes(movingData.seq)) {
    //             return 'FamillyChildToParent'; // 관련기사 -> 주기사(자식이 부모로 변경): trade
    //         } else {
    //             if (!!!movingData.rel) {
    //                 return 'ParentToParent'; // 주기사 -> 타 주기사: drag
    //             } else {
    //                 return 'ChildToParent'; // 관련기사 -> 타 주기사: rollback
    //             }
    //         }
    //     } else {
    //         if (movingData.parentTotalId === overData.parentTotalId) {
    //             return 'FamillyChildToChild'; // 관련기사 -> 관련기사(형제) : drag, sort
    //         } else {
    //             return 'ChildToChild'; // 관련기사 -> 타 관련기사 : rollback
    //         }
    //     }
    // };

    // // rollback
    // const rollbackRows = (api) => {
    //     api.setRowData(deskingWorks);
    // };

    // // 관련기사 추가
    // const appendRelRows = (api, movingData) => {
    //     // display 기준으로 새로운 rows생성
    //     let newStore = [];
    //     for (let i = 0; i < api.getDisplayedRowCount(); i++) {
    //         newStore.push(api.getDisplayedRowAtIndex(i).data);
    //     }
    //     let toIndex = newStore.indexOf(movingData) + 1; // 이동하는 노드의 아래에 넣는다.
    //     for (let i = 0; i < moveRows.length; i++) {
    //         newStore.splice(toIndex + i, 0, moveRows[i]);
    //     }
    //     api.setRowData(newStore);
    //     setMoveRows([]);
    // };

    // /**
    //  * 드래그 종료
    //  *  주기사의 가족내 이동은 가능
    //  *  주기사 : 타 관련기사이동 불가. 순서조정 가능.
    //  *  관련기사 : 타 주기사로 변경 불가, 타 관련기사로 이동 불가
    //  */
    // const handleRowDragEnd = (params) => {
    //     const movingNode = params.node;
    //     const overNode = params.overNode;
    //     const rowNeedsToMove = movingNode !== overNode;
    //     let rollback = true;
    //     // let isRelInsert = params.event.ctrlKey;  // 관련기사로 넣을지 여부

    //     if (rowNeedsToMove) {
    //         const moveMode = getMoveMode(movingNode.data, overNode.data);
    //         if (moveMode.includes('Familly')) {
    //             // 주기사 -> 관련기사(부모가 자식으로 변경): trade
    //             if (moveMode === 'FamillyParentToChild') {
    //                 // 서버에서 trade
    //                 rollback = false;
    //             }

    //             // 관련기사 -> 주기사(자식이 부모로 변경): trade
    //             if (moveMode === 'FamillyChildToParent') {
    //                 // 서버에서 trade
    //                 rollback = false;
    //             }

    //             // 관련기사 -> 관련기사(형제) : drag
    //             if (moveMode === 'FamillyChildToChild') {
    //                 // 서버에서 sort
    //                 // 할일없음.
    //                 rollback = false;
    //             }
    //         }

    //         // rollback
    //         if (moveMode === 'ParentToChild' || moveMode === 'ChildToParent' || moveMode === 'ChildToChild') {
    //             toastr.warning('드래그드랍 오류', '이동할 수 없습니다');
    //         }
    //     }

    //     if (rollback) {
    //         rollbackRows(params.api, movingNode.data);
    //     } else if (movingNode.data.relSeqs && movingNode.data.relSeqs.length > 0) {
    //         appendRelRows(params.api, movingNode.data);
    //     }
    // };

    /**
     * row height 제어 (관련기사는 height가 작음)
     * @param {object} params ag-grid instance
     */
    const getRowHeight = (params) => {
        return params.data.rel ? 42 : 53;
    };

    return (
        <div className="ag-theme-moka-desking-grid px-1">
            <AgGridReact
                immutableData
                onGridReady={handleGridReady}
                rowData={rowData}
                getRowNodeId={(params) => params.totalId}
                columnDefs={columnDefs}
                // onRowDragEnter={onRowDragEnter}
                // onRowDragEnd={handleRowDragEnd}
                rowSelection="multiple"
                rowDragManaged
                animateRows
                enableMultiRowDragging
                suppressRowClickSelection
                suppressMoveWhenRowDragging
                headerHeight={0}
                rowClassRules={rowClassRules}
                stopEditingWhenGridLosesFocus
                undoRedoCellEditing
                getRowHeight={getRowHeight}
                frameworkComponents={{ imageRenderer: MokaTableImageRenderer }}
            />
            {componentAgGridInstances[agGridIndex] && <DeskingReadyGrid componentAgGridInstances={componentAgGridInstances} agGridIndex={agGridIndex} component={component} />}
        </div>
    );
};

export default DeskingWorkAgGrid;
