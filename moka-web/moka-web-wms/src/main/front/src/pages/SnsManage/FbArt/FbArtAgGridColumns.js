import React from 'react';
import { EtcButtonRenderer } from './GridRenderer';

export default [
    {
        headerName: 'ID',
        field: 'id',
        width: 80,
        tooltipFied: 'id',
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '전송일시',
        field: 'sendDt',
        width: 90,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '이미지',
        field: 'imgUrl',
        cellRenderer: 'imageRenderer',
        width: 78,
    },
    {
        headerName: 'SNS제목',
        field: 'title',
        wrapText: true,
        width: 250,
        flex: 1,
        tooltipField: 'title',
        cellRendererFramework: ({ value }) => {
            return (
                <>
                    <div
                        style={{
                            boxSizing: 'border-box',
                            whiteSpace: 'normal',
                            lineHeight: '20px',
                            fontSize: '14px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {value}
                    </div>
                </>
            );
        },
        cellStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            height: '100%',
        },
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 64,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '기타',
        field: 'id',
        width: 188,
        cellRendererFramework: EtcButtonRenderer,
    },
];
