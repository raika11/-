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
        headerName: '번호',
        field: 'repSeq',
        width: 60,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        width: 120,
        tooltipField: 'joinsId',
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 50,
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '이름',
        field: 'repName',
        width: 75,
    },
    {
        headerName: '소속',
        field: 'belong',
        width: 200,
        tooltipField: 'belong',
    },
    {
        headerName: '직책',
        field: 'repTitle',
        width: 100,
        tooltipField: 'repTitle',
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        width: 180,
        flex: 1,
        tooltipField: 'repEmail1',
    },
];
