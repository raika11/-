import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData, rowClassRules } from './data';

const AgGridPage = () => {
    const onRowDragEnter = (params) => {
        debugger;
        const data = params.node.data;
        if (data.relContentIds && data.relContentIds.length > 0) {
            const newRowData = rowData.filter(
                (node) => !data.relContentIds.includes(node.contentsId)
            );
            params.api.setRowData(newRowData);
        }
        // console.log('onRowDragEnter', params);
    };

    const onRowDragMove = (event) => {
        var movingNode = event.node;
        var overNode = event.overNode;
        var rowNeedsToMove = movingNode !== overNode;
        if (rowNeedsToMove) {
            debugger;
            var movingData = movingNode.data;
            var overData = overNode.data;
            let fromIndex = rowData.indexOf(movingData);
            var toIndex = rowData.indexOf(overData);
            var newStore = rowData.slice();

            moveInArray(newStore, fromIndex, toIndex);
            if (movingData.relContentIds && movingData.relContentIds.length > 0) {
                movingData.relContentIds.forEach((relContentsId) => {
                    fromIndex = newStore.findIndex((node) => node.contentsId === relContentsId);
                    moveInArray(newStore, fromIndex, toIndex);
                });
            }

            event.api.setRowData(newStore);
            event.api.clearFocusedCell();
        }
        function moveInArray(arr, fromIndex, toIndex, relCnt) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1 + relCnt);
            arr.splice(toIndex, 0, element);
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
                            // onRowDragEnter={onRowDragEnter}
                            onRowDragMove={onRowDragMove}
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
