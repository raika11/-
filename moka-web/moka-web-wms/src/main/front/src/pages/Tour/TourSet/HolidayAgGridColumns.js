import React from 'react';
import Button from 'react-bootstrap/Button';

export default [
    {
        headerName: '휴일명',
        field: 'denyTitle',
        width: 320,
    },
    {
        headerName: '날짜',
        field: 'denyDate',
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
                    <Button className="mr-2" variant="outline-table-btn" size="sm" onClick={() => data.onModify(data)}>
                        수정
                    </Button>
                    <Button variant="outline-table-btn" size="sm" onClick={() => data.onDelete(data)}>
                        삭제
                    </Button>
                </div>
            );
        },
    },
];
