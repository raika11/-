import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData, rowClassRules } from './data';

const AgGridPage = () => {
    const [moveRows, setMoveRows] = useState([]);

    const onRowDragEnter = (params) => {
        const data = params.node.data;
        if (data.relSeqs && data.relSeqs.length > 0) {
            let fromIndex = rowData.indexOf(data);
            setMoveRows(rowData.slice(fromIndex + 1, fromIndex + 1 + data.relSeqs.length));
            let newRowData = rowData.filter((node) => !data.relSeqs.includes(node.seq));
            params.api.setRowData(newRowData);
        }
    };

    /**
     * 주기사의 가족내 이동은 가능
     * 주기사->타 관련기사이동 불가. 순서조정 가능.
     * 관련기사->주기사로 변경 불가, 타 관련기사로 이동 불가
     */
    const onRowDragEnd = (params) => {
        var movingNode = params.node;
        var overNode = params.overNode;
        var rowNeedsToMove = movingNode !== overNode;

        // 관련기사로 넣을지 여부
        // let isRelInsert = params.event.ctrlKey;

        if (rowNeedsToMove) {
            // 주기사 여부
            const srcIsOwner = !!!movingNode.data.rel;
            const overIsOwner = !!!overNode.data.rel;

            if (srcIsOwner) {
                if (overIsOwner) {
                    // 1. 주기사 -> 주기사 이동 : 소스 주기사의 관련기사를 추가한다.
                    if (movingNode.data.relSeqs && movingNode.data.relSeqs.length > 0) {
                        // display 기준으로 새로운 rows생성
                        let newStore = [];
                        for (let i = 0; i < params.api.getDisplayedRowCount(); i++) {
                            newStore.push(params.api.getDisplayedRowAtIndex(i).data);
                        }
                        let toIndex = newStore.indexOf(movingNode.data) + 1; // 이동하는 노드의 아래에 넣는다.
                        for (let i = 0; i < moveRows.length; i++) {
                            newStore.splice(toIndex + i, 0, moveRows[i]);
                        }
                        params.api.setRowData(newStore);
                        setMoveRows([]);
                    }
                } else {
                    // 오버기사가 주기사의 자식인지 조사
                    const isChildRel = movingNode.data.relSeqs.includes(overNode.data.seq);

                    if (isChildRel) {
                        // 2. 주기사 -> 자신의 관련영역 으로 이동 : 주인과 자식 교체
                    } else {
                        // 3. 주기사 -> 다른기사의 관련영역 으로 이동 : 불가
                    }
                }
            }
        }
    };

    return (
        <Container fluid className="p-0">
            <Row>
                <Col lg="12">
                    <div className="ag-theme-moka-grid">
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
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AgGridPage;
