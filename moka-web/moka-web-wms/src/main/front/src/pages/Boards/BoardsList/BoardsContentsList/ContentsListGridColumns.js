import React from 'react';
import RegistItemRenderer from './RegistItemRenderer';
import FileItemRenderer from './FileItemRenderer';
import TitleItemRenderer from './TitleItemRenderer';

export const ColumnDefs = [
    {
        headerName: '번호',
        field: 'boardSeq',
        width: 70,
    },
    // front 에서 각 게시글 마다에 채널명을 가지고 올수가 없어서 안보이게 처리.
    // {
    //     headerName: '채널명',
    //     field: 'channelName',
    //     width: 150,
    // },
    {
        headerName: '제목',
        field: 'titleItem',
        width: 250,
        flex: 1,
        cellRendererFramework: (params) => <TitleItemRenderer paramsValue={params.value} />,
    },
    {
        headerName: '말머리1',
        field: 'titlePrefix1',
        width: 120,
    },
    {
        headerName: '등록일시\n등록자',
        field: 'registItem',
        width: 120,
        cellRendererFramework: (params) => <RegistItemRenderer regDt={params.value.regDt} regName={params.value.regName} />,
    },
    {
        headerName: '조회수',
        field: 'viewCnt',
        width: 60,
    },
    {
        headerName: '첨부파일',
        field: 'fileItem',
        width: 80,
        cellRendererFramework: (params) => <FileItemRenderer attaches={params.value.attaches} />,
    },
];
