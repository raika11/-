import { Button, Col, Row } from 'react-bootstrap';
import React from 'react';
import commonUtil from '@utils/commonUtil';

export const columnDefs = [
    {
        headerName: '',
        field: 'insert',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
        cellRendererFramework: (param) => {
            return (
                <Row className="d-flex w-100 align-items-center justify-content-center mr-0">
                    <Col className="w-100">
                        <Button
                            variant="outline-table-btn"
                            onClick={() => {
                                if (!commonUtil.isEmpty(param.data.onAdd) && param.data.onAdd instanceof Function) {
                                    param.data.onAdd(param.data);
                                }
                            }}
                        >
                            등록
                        </Button>
                    </Col>
                </Row>
            );
        },
    },
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '분류',
        field: 'section',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '투표 제목',
        field: 'title',
        width: 70,
        flex: 1,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
    {
        headerName: '상태',
        field: 'status',
        width: 70,
        cellStyle: { fontSize: '12px', lineHeight: '65px' },
    },
];
