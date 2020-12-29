import React from 'react';
import Button from 'react-bootstrap/Button';

export default [
    {
        headerName: '휴일명',
        field: 'holidayName',
        cellStyle: { fontSize: '12px' },
        width: 350,
    },
    {
        headerName: '날짜',
        field: 'date',
        cellStyle: { fontSize: '12px' },
        width: 350,
    },
    {
        headerName: '',
        field: 'editButton',
        cellStyle: { fontSize: '12px' },
        flex: 1,
        cellRendererFramework: () => {
            return (
                <div className="d-flex">
                    <Button className="mr-2" variant="outline-table-btn2">
                        수정
                    </Button>
                    <Button variant="outline-table-btn2">삭제</Button>
                </div>
            );
        },
    },
];
