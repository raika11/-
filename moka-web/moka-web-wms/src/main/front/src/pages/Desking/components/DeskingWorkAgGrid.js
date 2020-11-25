import React, { useState, useEffect, useCallback } from 'react';
import produce from 'immer';
import { AgGridReact } from 'ag-grid-react';
import { unescapeHtml } from '@utils/convertUtil';
import toast from '@utils/toastUtil';
import { MokaTableImageRenderer } from '@components';
import { columnDefs, rowClassRules } from './DeskingWorkAgGridColumns';
import DeskingReadyGrid from './DeskingReadyGrid';

/**
 * 데스킹 AgGrid
 */
const DeskingWorkAgGrid = (props) => {
    const { component, agGridIndex, componentAgGridInstances, setComponentAgGridInstances, onRowClicked, onSave, onDelete } = props;
    const { deskingWorks } = component;
    const [relRows, setRelRows] = useState([]);

    // local state
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);

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
        setGridApi(params);
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
     * row 드래그 시작
     * @param {object} params ag-grid instance
     */
    const handleRowDragEnter = (params) => {
        const data = params.node.data;
        let fromIndex = deskingWorks.findIndex((d) => d.seq === data.seq);

        // 관련기사 삭제
        if (fromIndex > -1 && data.relSeqs && data.relSeqs.length > 0) {
            setRelRows(deskingWorks.slice(fromIndex + 1, fromIndex + 1 + data.relSeqs.length));
            let newRel = deskingWorks.filter((node) => !data.relSeqs.includes(node.seq));
            params.api.setRowData(newRel);
        }
    };

    /**
     * 드래그 시작점, 목적지 검사
     * @param {object} movingData 드래그 중인 데이터
     * @param {object} overData 마우스 오버된 row의 데이터
     */
    const getMoveMode = (movingData, overData) => {
        if (movingData.rel) {
            if (movingData.relSeqs && movingData.relSeqs.includes(overData.seq)) {
                // 주기사 -> 관련기사(부모가 자식으로 변경): trade
                return 'FamillyParentToChild';
            } else {
                if (overData.rel) {
                    // 주기사 -> 타 주기사: drag
                    return 'ParentToParent';
                } else {
                    // 주기사 -> 타 관련기사: rollback
                    return 'ParentToChild';
                }
            }
        } else if (overData.rel) {
            if (overData.relSeqs && overData.relSeqs.includes(movingData.seq)) {
                // 관련기사 -> 주기사(자식이 부모로 변경): trade
                return 'FamillyChildToParent';
            } else {
                if (movingData.rel) {
                    // 주기사 -> 타 주기사: drag
                    return 'ParentToParent';
                } else {
                    // 관련기사 -> 타 주기사: rollback
                    return 'ChildToParent';
                }
            }
        } else {
            if (movingData.parentTotalId === overData.parentTotalId) {
                // 관련기사 -> 관련기사(형제) : drag, sort
                return 'FamillyChildToChild';
            } else {
                // 관련기사 -> 타 관련기사 : rollback
                return 'ChildToChild';
            }
        }
    };

    /**
     * rollback
     * @param {object} api
     */
    const rollbackRows = (api) => api.setRowData(rowData);

    /**
     * 관련기사 추가
     * @param {object} api
     * @param {object} movingData
     */
    const appendRelRows = (api, movingData) => {
        // display 기준으로 새로운 rows생성
        let newStore = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            newStore.push(api.getDisplayedRowAtIndex(i).data);
        }
        let toIndex = newStore.indexOf(movingData) + 1; // 이동하는 노드의 아래에 넣는다.
        for (let i = 0; i < relRows.length; i++) {
            newStore.splice(toIndex + i, 0, relRows[i]);
        }
        api.setRowData(newStore);
        setRelRows([]);
    };

    /**
     * 드래그 종료
     *  주기사의 가족내 이동은 가능
     *  주기사 <=> 주기사, 주기사 <=> 본인의 관련기사 가능
     *  주기사 => 타 관련기사 불가, 관련기사 => 타 주기사 불가, 관련기사 <=> 타 관련기사 불가
     */
    const handleRowDragEnd = (params) => {
        const movingNode = params.node;
        const overNode = params.overNode;
        const sameNode = movingNode === overNode;
        let rollback = true;
        // let isRelInsert = params.event.ctrlKey;  // 관련기사로 넣을지 여부

        if (!sameNode) {
            const moveMode = getMoveMode(movingNode.data, overNode.data);
            if (moveMode.includes('Familly')) {
                // 주기사 -> 관련기사(부모가 자식으로 변경): trade
                if (moveMode === 'FamillyParentToChild') {
                    // 서버에서 trade
                    rollback = false;
                }

                // 관련기사 -> 주기사(자식이 부모로 변경): trade
                if (moveMode === 'FamillyChildToParent') {
                    // 서버에서 trade
                    rollback = false;
                }

                // 관련기사 -> 관련기사(형제) : drag
                if (moveMode === 'FamillyChildToChild') {
                    // 서버에서 sort
                    // 할일없음.
                    rollback = false;
                }
            }

            // rollback
            if (moveMode === 'ParentToChild' || moveMode === 'ChildToParent' || moveMode === 'ChildToChild') {
                toast.warn('이동할 수 없습니다');
            }
        }

        if (rollback) {
            rollbackRows(params.api, movingNode.data);
        } else if (movingNode.data.relSeqs && movingNode.data.relSeqs.length > 0) {
            appendRelRows(params.api, movingNode.data);
        }
    };

    /**
     * row height 제어 (관련기사는 height가 작음)
     * @param {object} params ag-grid instance
     */
    const getRowHeight = (params) => {
        return params.data.rel ? 42 : 53;
    };

    useEffect(() => {
        if (gridApi) {
            gridApi.api.redrawRows();
        }
    }, [deskingWorks, gridApi]);

    return (
        <div className="ag-theme-moka-desking-grid px-1">
            <AgGridReact
                immutableData
                onGridReady={handleGridReady}
                rowData={rowData}
                getRowNodeId={(params) => params.totalId}
                columnDefs={columnDefs}
                onRowDragEnter={handleRowDragEnter}
                onRowDragEnd={handleRowDragEnd}
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
                frameworkComponents={{ imageRenderer: MokaTableImageRenderer }}
            />
            {componentAgGridInstances[agGridIndex] && <DeskingReadyGrid componentAgGridInstances={componentAgGridInstances} agGridIndex={agGridIndex} component={component} />}
        </div>
    );
};

export default DeskingWorkAgGrid;
