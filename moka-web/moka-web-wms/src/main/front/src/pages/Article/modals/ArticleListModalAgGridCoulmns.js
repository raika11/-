import React from 'react';
import Button from 'react-bootstrap/Button';

export default [
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
        width: 85,
        field: 'totalId',
        cellClass: 'user-select-text',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
    {
        headerName: '매체',
        width: 100,
        field: 'sourceName',
        tooltipField: 'sourceName',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '제목',
        field: 'escapeTitle',
        width: 186,
        flex: 1,
        autoHeight: true,
        tooltipField: 'escapeTitle',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '출고시간',
        width: 130,
        field: 'serviceDaytime',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
        },
    },
];
