import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData, rowClassRules } from './data';
import toast from '@/utils/toastUtil';
import { EditThumbModal } from '@pages/Desking/modals';

const AgGridPage = () => {
    const [moveRows, setMoveRows] = useState([]);

    // 드래그 시작
    const onRowDragEnter = (params) => {
        const data = params.node.data;
        let fromIndex = rowData.indexOf(data);

        // 관련기사 삭제
        if (data.relSeqs && data.relSeqs.length > 0) {
            setMoveRows(rowData.slice(fromIndex + 1, fromIndex + 1 + data.relSeqs.length));
            let newRowData = rowData.filter((node) => !data.relSeqs.includes(node.seq));
            params.api.setRowData(newRowData);
            // } else {
            //     setMoveRows(rowData.slice(fromIndex, fromIndex));
        }
    };

    // 드래그의 의미
    const getMoveMode = (movingData, overData) => {
        if (!!!movingData.rel) {
            if (movingData.relSeqs && movingData.relSeqs.includes(overData.seq)) {
                return 'FamillyParentToChild'; // 주기사 -> 관련기사(부모가 자식으로 변경): trade
            } else {
                if (!!!overData.rel) {
                    return 'ParentToParent'; // 주기사 -> 타 주기사: drag
                } else {
                    return 'ParentToChild'; // 주기사 -> 타 관련기사: rollback
                }
            }
        } else if (!!!overData.rel) {
            if (overData.relSeqs && overData.relSeqs.includes(movingData.seq)) {
                return 'FamillyChildToParent'; // 관련기사 -> 주기사(자식이 부모로 변경): trade
            } else {
                if (!!!movingData.rel) {
                    return 'ParentToParent'; // 주기사 -> 타 주기사: drag
                } else {
                    return 'ChildToParent'; // 관련기사 -> 타 주기사: rollback
                }
            }
        } else {
            if (movingData.parentSeq === overData.parentSeq) {
                return 'FamillyChildToChild'; // 관련기사 -> 관련기사(형제) : drag, sort
            } else {
                return 'ChildToChild'; // 관련기사 -> 타 관련기사 : rollback
            }
        }
    };

    // rollback
    const rollbackRows = (api) => {
        api.setRowData(rowData);
    };

    // 관련기사 추가
    const appendRelRows = (api, movingData) => {
        // display 기준으로 새로운 rows생성
        let newStore = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            newStore.push(api.getDisplayedRowAtIndex(i).data);
        }
        let toIndex = newStore.indexOf(movingData) + 1; // 이동하는 노드의 아래에 넣는다.
        for (let i = 0; i < moveRows.length; i++) {
            newStore.splice(toIndex + i, 0, moveRows[i]);
        }
        api.setRowData(newStore);
        setMoveRows([]);
    };

    /**
     * 드래그 종료
     *  주기사의 가족내 이동은 가능
     *  주기사 : 타 관련기사이동 불가. 순서조정 가능.
     *  관련기사 : 타 주기사로 변경 불가, 타 관련기사로 이동 불가
     */
    const onRowDragEnd = (params) => {
        const movingNode = params.node;
        const overNode = params.overNode;
        const rowNeedsToMove = movingNode !== overNode;
        let rollback = true;
        // let isRelInsert = params.event.ctrlKey;  // 관련기사로 넣을지 여부

        if (rowNeedsToMove) {
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
                toast.warning('이동할 수 없습니다');
            }
        }

        if (rollback) {
            rollbackRows(params.api, movingNode.data);
        } else if (movingNode.data.relSeqs && movingNode.data.relSeqs.length > 0) {
            appendRelRows(params.api, movingNode.data);
        }
    };

    // row height제어. 관련기사는 height가 작다.
    const getRowHeight = (params) => {
        return params.data.rowHeight ? params.data.rowHeight : 53;
    };

    return (
        <Container fluid className="p-0">
            <Row>
                <Col lg="12">
                    <div className="ag-theme-moka-desking-grid">
                        <AgGridReact
                            rowData={rowData}
                            getRowNodeId={(params) => params.contentsId}
                            columnDefs={columnDefs}
                            onRowDragEnter={onRowDragEnter}
                            onRowDragEnd={onRowDragEnd}
                            // onRowDragMove={onRowDragMove}
                            rowSelection="multiple"
                            rowDragManaged
                            animateRows
                            enableMultiRowDragging
                            suppressRowClickSelection
                            suppressMoveWhenRowDragging
                            immutableData
                            headerHeight={0}
                            rowClassRules={rowClassRules}
                            stopEditingWhenGridLosesFocus
                            undoRedoCellEditing
                            getRowHeight={getRowHeight}
                        />
                    </div>
                </Col>
            </Row>
            <EditThumbModal show={true} onHide={() => {}} />
        </Container>
    );
};

export default AgGridPage;
