import React, { useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaTable } from '@/components';
import columnDefs, { rowData } from './BannerModalAgGridColumns';

const BannerModal = (props) => {
    const { show, onHide } = props;

    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    const handleRowClicked = useCallback((row) => console.log(row), []);

    return (
        <MokaModal title="다른 주제 공통 배너 관리" show={show} onHide={onHide} size="xl">
            <Container className="p-0" fluid>
                <Row>
                    <Col className="p-0 custom-scroll d-flex flex-column" style={{ minWidth: 500, minHeight: 650 }}>
                        <div className="mb-2 d-flex justify-content-end">
                            <Button variant="positive">등록</Button>
                        </div>
                        <MokaTable
                            className="overflow-hidden flex-fill"
                            columnDefs={columnDefs}
                            rowData={rowData}
                            onRowNodeId={(params) => params.seqNo}
                            onRowClicked={handleRowClicked}
                            // loading={loading}
                            total={total}
                            page={search.page}
                            size={search.size}
                            // selected={rowData.seqNo}
                            onChangeSearchOption={handleChangeSearchOption}
                        />
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </MokaModal>
    );
};

export default BannerModal;
