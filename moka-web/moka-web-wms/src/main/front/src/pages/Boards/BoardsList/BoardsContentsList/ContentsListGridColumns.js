import React from 'react';
import RegistItemRenderer from './RegistItemRenderer';
import FileItemRenderer from './FileItemRenderer';
import TitleItemRenderer from './TitleItemRenderer';

export const ColumnDefs = [
    {
        headerName: '번호',
        field: 'boardSeq',
        width: 70,
        cellStyle: { fontSize: '12px', paddingTop: '5px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '채널명',
        field: 'channelName',
        width: 150,
        cellStyle: { fontSize: '12px', paddingTop: '5px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '제목',
        field: 'titleItem',
        width: 200,
        flex: 1,
        cellRendererFramework: (params) => <TitleItemRenderer title={params.value.title} usedYn={params.value.usedYn} />,
        cellStyle: { fontSize: '12px', paddingTop: '5px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '말머리1',
        field: 'titlePrefix1',
        width: 100,
        cellStyle: { fontSize: '12px', paddingTop: '5px' },
        cellClass: ['text-left', 'pl-1'],
    },
    {
        headerName: '등록일시\n등록자',
        field: 'registItem',
        width: 120,
        cellRendererFramework: (params) => <RegistItemRenderer regDt={params.value.regDt} regId={params.value.regId} />,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '조회수',
        field: 'viewCount',
        width: 60,
        cellStyle: { fontSize: '12px', paddingTop: '5px' },
        cellClass: ['text-left'],
    },
    {
        headerName: '첨부파일',
        field: 'fileItem',
        width: 60,
        cellRendererFramework: (params) => <FileItemRenderer fileYn={params.value.fileYn} file={params.value.file} />,
        cellStyle: { fontSize: '12px' },
        cellClass: ['text-left'],
    },
];
