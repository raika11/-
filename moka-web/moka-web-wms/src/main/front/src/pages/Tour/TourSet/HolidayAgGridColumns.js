import React from 'react';
import Button from 'react-bootstrap/Button';
import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export default [
    {
        headerName: '휴일명',
        field: 'denyTitle',
        width: 320,
        cellStyle,
    },
    {
        headerName: '날짜',
        field: 'denyDate',
        width: 320,
        cellStyle,
    },
    {
        headerName: '',
        field: 'editButton',
        flex: 1,
        cellRendererFramework: (params) => {
            const { data } = params;
            return (
                <div className="h-100 d-flex align-items-center">
                    <Button className="mr-1" variant="outline-table-btn" size="sm" onClick={() => data.onModify(data)}>
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
