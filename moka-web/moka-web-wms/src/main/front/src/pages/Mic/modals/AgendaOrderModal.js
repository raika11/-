import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaModal } from '@/components';
import columnDefs, { rowData } from './AgendaOrderModalAgGridColumns';

const AgendaOrderModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal
            height={685}
            title="아젠다 순서"
            show={show}
            onHide={onHide}
            size="sm"
            headerClassName="justify-content-start"
            bodyClassName="pb-2"
            buttons={[
                { text: '수정', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <Container className="p-0" fluid>
                <Row>
                    <Col xs={12} className="p-0">
                        <div className="ag-theme-moka-desking-grid position-relative">
                            <AgGridReact
                                immutableData
                                rowData={rowData}
                                getRowNodeId={(params) => params.orderNm}
                                columnDefs={columnDefs}
                                // onRowSelected={handleRowSelected}
                                animateRows
                                rowDragManaged={true}
                                suppressRowClickSelection
                                // onCellClicked={handleCellClicked}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default AgendaOrderModal;
