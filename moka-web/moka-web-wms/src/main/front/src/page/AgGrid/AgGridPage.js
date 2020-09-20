import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs, rowData, rowClassRules } from './data';

const AgGridPage = () => {
    return (
        <Container fluid className="p-0">
            <Row>
                <Col lg="12">
                    <div className="ag-theme-moka-grid">
                        <AgGridReact
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
                            rowClassRules={rowClassRules}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AgGridPage;
