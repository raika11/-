import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData, rowClassRules } from './data';

const AgGridPage = () => {
    // let appendStore = [];

    const onRowDragEnter = (params) => {
        const data = params.node.data;
        if (data.relContentIds && data.relContentIds.length > 0) {
            // let fromIndex = rowData.indexOf(data);
            // appendStore = rowData.slice(fromIndex + 1, fromIndex + 1 + data.relContentIds.length);
            let newRowData = rowData.filter(
                (node) => !data.relContentIds.includes(node.contentsId)
            );
            params.api.setRowData(newRowData);
        }
    };

    const onRowDragEnd = (params) => {
        // var movingNode = params.node;
        // var overNode = params.overNode;
        // var rowNeedsToMove = movingNode !== overNode;
        // if (rowNeedsToMove) {
        //     let newStore = rowData.slice();
        //     let toIndex = rowData.indexOf(overNode);
        //     for (let i = 0; i < appendStore.length; i++) {
        //         newStore.splice(toIndex + i, 0, appendStore[i]);
        //     }
        //     params.api.setRowData(newStore);
        //     appendStore = [];
        // }
    };

    // const onRowDragMove = (event) => {
    //     var movingNode = event.node;
    //     var overNode = event.overNode;
    //     var rowNeedsToMove = movingNode !== overNode;

    //     const relCnt = movingNode.data.relContentIds ? movingNode.data.relContentIds.length : 0;

    //     if (rowNeedsToMove) {
    //         var movingData = movingNode.data;
    //         var overData = overNode.data;
    //         let fromIndex = rowData.indexOf(movingData);
    //         // var toIndex = rowData.indexOf(overData);
    //         var newStore = rowData.slice();

    //         const appendStore = newStore.slice(fromIndex, fromIndex+ 1 + relCnt);

    //         // delete
    //         newStore.splice(fromIndex, 1 + relCnt);

    //         // append
    //         var toIndex = newStore.indexOf(overData);
    //         for (let i = 0 ; i < appendStore.length; i++) {
    //             newStore.splice(toIndex + i, 0, appendStore[i]);
    //         }

    //         event.api.setRowData(newStore);
    //         event.api.clearFocusedCell();
    //     }
    // };

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
