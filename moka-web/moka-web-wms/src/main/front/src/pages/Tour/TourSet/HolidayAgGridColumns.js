import React from 'react';
import Button from 'react-bootstrap/Button';

export default [
    {
        headerName: '휴일명',
        field: 'holidayName',
        cellStyle: { fontSize: '12px' },
        width: 320,
    },
    {
        headerName: '날짜',
        field: 'date',
        cellStyle: { fontSize: '12px' },
        width: 320,
    },
    {
        headerName: '',
        field: 'editButton',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        flex: 1,
        cellRendererFramework: (params) => {
            const { data } = params;
            return (
                <div>
                    <Button className="mr-2" variant="outline-table-btn" size="sm" onClick={data.onModify}>
                        수정
                    </Button>
                    <Button variant="outline-table-btn" size="sm" onClick={data.onDelete}>
                        삭제
                    </Button>
                </div>
            );
        },
    },
];
