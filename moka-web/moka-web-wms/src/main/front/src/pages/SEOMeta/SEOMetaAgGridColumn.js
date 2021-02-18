import { Button } from 'react-bootstrap';
import React from 'react';

export const columnDefs = [
    {
        headerName: '출처',
        field: 'sourceName',
        width: 120,
        cellStyle: { fontSize: '12px' },
        tooltipField: 'sourceName',
    },
    {
        headerName: '출고일',
        field: 'serviceDt',
        width: 120,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '제목',
        field: 'artTitle',
        flex: 1,
        width: 80,
        cellStyle: { fontSize: '12px' },
    },
    {
        headerName: '기능',
        field: 'button',
        width: 80,
        cellRendererFramework: (param) => (
            <Button
                variant={param.value.variant}
                size="sm"
                onClick={() => {
                    param.value.onClick(param.data.totalId);
                }}
            >
                {param.value.name}
            </Button>
        ),
    },
];
