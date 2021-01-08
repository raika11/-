import { Button } from 'react-bootstrap';
import React from 'react';

export const columnDefs = [
    {
        headerName: 'ID',
        field: 'id',
        width: 70,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '출고일',
        field: 'serviceDt',
        width: 130,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '제목',
        field: 'title',
        flex: 1,
        width: 80,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '',
        field: 'button',
        width: 80,
        cellRendererFramework: (param) => (
            <Button
                variant={param.value.variant}
                size="sm"
                onClick={() => {
                    param.value.onClick(param.data.id);
                }}
            >
                {param.value.name}
            </Button>
        ),
    },
];
