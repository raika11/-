import { Button, Col, Row } from 'react-bootstrap';
import React from 'react';
import commonUtil from '@utils/commonUtil';

export const columnDefs = [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRendererFramework: (row) => {
            const { data } = row;
            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <Button
                        variant="outline-table-btn"
                        onClick={() => {
                            if (data.onClick instanceof Function) {
                                const temp = { ...data };
                                delete temp.onClick;
                                row.data.onClick(temp);
                            }
                        }}
                        size="sm"
                    >
                        등록
                    </Button>
                </div>
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
        field: 'category',
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
