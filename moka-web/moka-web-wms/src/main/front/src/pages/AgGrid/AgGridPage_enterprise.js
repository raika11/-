import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { RowGroupingModule } from 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { columnDefs, rowData } from './data';

const AgGridPage = () => {
    const agModules = useState([ClientSideRowModelModule, RowGroupingModule]);
    const agAutoGroupColumnDef = useState({
        rowDrag: true,
        headerName: 'Files',
        minWidth: 300,
        // cellRendererParams: {
        //     suppressCount: true,
        //     innerRenderer: 'fileCellRenderer'
        // }
        cellRenderer: (params) => {
            let tempDiv = '';
            let filename = params.data.filename;
            let icon =
                filename.endsWith('.mp3') || filename.endsWith('.wav')
                    ? 'far fa-file-audio'
                    : filename.endsWith('.xls')
                    ? 'far fa-file-excel'
                    : filename.endsWith('.txt')
                    ? 'far fa-file'
                    : filename.endsWith('.pdf')
                    ? 'far fa-file-pdf'
                    : 'far fa-folder';
            tempDiv = icon
                ? '<i class="' + icon + '"/>' + '<span class="filename">' + filename + '</span>'
                : filename;
            return tempDiv;
        }
    });

    const moveToPath = (newParentPath, node, allUpdatedNodes) => {
        var oldPath = node.data.filePath;
        var fileName = oldPath[oldPath.length - 1];
        var newChildPath = newParentPath.slice();
        newChildPath.push(fileName);
        node.data.filePath = newChildPath;
        allUpdatedNodes.push(node.data);
        if (node.childrenAfterGroup) {
            node.childrenAfterGroup.forEach(function (childNode) {
                moveToPath(newChildPath, childNode, allUpdatedNodes);
            });
        }
    };

    const isSelectionParentOfTarget = (selectedNode, targetNode) => {
        var children = selectedNode.childrenAfterGroup;
        for (var i = 0; i < children.length; i++) {
            if (targetNode && children[i].key === targetNode.key) return true;
            isSelectionParentOfTarget(children[i], targetNode);
        }
        return false;
    };

    const arePathsEqual = (path1, path2) => {
        if (path1.length !== path2.length) {
            return false;
        }
        var equal = true;
        path1.forEach(function (item, index) {
            if (path2[index] !== item) {
                equal = false;
            }
        });
        return equal;
    };

    const onGridReady = (params) => {
        // gridApi  p= params.api;
        // gridColumnApi =arams.columnApi;
    };

    const onRowDragEnd = (event) => {
        var overNode = event.overNode;
        if (!overNode) {
            return;
        }
        var folderToDropInto = overNode.data.type === 'folder' ? overNode : overNode.parent;
        var movingData = event.node.data;
        var newParentPath = folderToDropInto.data ? folderToDropInto.data.filePath : [];
        var needToChangeParent = !arePathsEqual(newParentPath, movingData.filePath);
        var invalidMode = isSelectionParentOfTarget(event.node, folderToDropInto);
        if (invalidMode) {
            console.log('invalid move');
        }
        if (needToChangeParent && !invalidMode) {
            var updatedRows = [];
            moveToPath(newParentPath, event.node, updatedRows);
            this.gridApi.applyTransaction({ update: updatedRows });
            this.gridApi.clearFocusedCell();
        }
    };

    // function getFileIcon(filename) {
    //     return filename.endsWith('.mp3') || filename.endsWith('.wav')
    //         ? 'far fa-file-audio'
    //         : filename.endsWith('.xls')
    //         ? 'far fa-file-excel'
    //         : filename.endsWith('.txt')
    //         ? 'far fa-file'
    //         : filename.endsWith('.pdf')
    //         ? 'far fa-file-pdf'
    //         : 'far fa-folder';
    // }

    // const getFileCellRenderer = () => {
    //     function FileCellRenderer() {}
    //     FileCellRenderer.prototype.init = function (params) {
    //         var tempDiv = document.createElement('div');
    //         var value = params.value;
    //         var icon = getFileIcon(params.value);
    //         tempDiv.innerHTML = icon
    //             ? '<i class="' + icon + '"/>' + '<span class="filename">' + value + '</span>'
    //             : value;
    //         this.eGui = tempDiv.firstChild;
    //     };
    //     FileCellRenderer.prototype.getGui = function () {
    //         return this.eGui;
    //     };
    //     return FileCellRenderer;
    // };

    // const agComponent = { fileCellRenderer: getFileCellRenderer() };

    return (
        <Container fluid className="p-0">
            <Row>
                <Col lg="12">
                    <div style={{ height: '100%', width: '100%' }} className="ag-theme-balham">
                        <AgGridReact
                            modules={agModules}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            // defaultColDef={this.state.defaultColDef}
                            // components={agComponent}
                            treeData
                            animateRows
                            groupDefaultExpanded={-1}
                            getDataPath={(data) => data.filePath}
                            getRowNodeId={(data) => data.contentsId}
                            // autoGroupColumnDef={agAutoGroupColumnDef}
                            onGridReady={onGridReady}
                            onRowDragEnd={onRowDragEnd}
                        />
                        {/* <AgGridReact
                            rowData={rowData}
                            getRowNodeId={(params) => params.contentsId}
                            columnDefs={columnDefs}
                            rowSelection="multiple"
                            rowDragManaged
                            animateRows
                            enableMultiRowDragging
                            suppressRowClickSelection
                            suppressMoveWhenRowDragging
                            immutableData
                            headerHeight={0}
                            rowHeight={53}
                        /> */}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AgGridPage;
