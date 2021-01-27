import { MokaTableDeleteButton } from '@components';
import React from 'react';
import { Button } from 'react-bootstrap';

export default [
    {
        colId: '',
        field: '',
        width: 75,
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
                    >
                        등록
                    </Button>
                </div>
            );
        },
    },
    {
        headerName: '매체',
        width: 100,
        field: 'sourceName',
        tooltipField: 'sourceName',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: 'ID\n기사유형',
        width: 75,
        // width: 93,
        field: 'artIdType',
        cellStyle: {
            whiteSpace: 'pre-wrap',
            lineHeight: '20px',
            display: '-webkit-box',
            fontSize: '12px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            paddingTop: '5px',
        },
        tooltipField: 'artTypeName',
        cellClass: 'user-select-text',
    },
    {
        headerName: '사진',
        width: 60,
        field: 'artThumb',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '',
        width: 36,
        field: 'groupNumber',
        // 편집 그룹 + 동영상(OVP/YOUTUBE/둘다)
        cellRenderer: 'GroupNumberRenderer',
        cellStyle: { width: '36px' },
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
            fontSize: '14px',
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
        headerName: '면/판',
        width: 45,
        field: 'myunPan',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            whiteSpace: 'pre',
        },
    },
    {
        headerName: '출고시간\n수정시간',
        width: 85,
        field: 'articleDt',
        cellClassRules: {
            'pre-wrap-cell': () => true,
        },
        cellStyle: {
            height: '50px',
            lineHeight: '20px',
        },
    },
    {
        headerName: '기자명',
        width: 95,
        field: 'reportersText',
        tooltipField: 'artReporter',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
];
