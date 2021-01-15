import React from 'react';
import PostSelectRenderer from './components/PostSelectRenderer';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        width: 40,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '포스트',
        field: 'post',
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        flex: 1,
    },
    {
        headerName: '작성자',
        field: 'writer',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '공감수',
        field: 'count',
        width: 50,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '상태',
        field: 'state',
        width: 90,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
        cellRendererFramework: (params) => <PostSelectRenderer {...params} />,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 80,
        cellStyle: { fontSize: '12px', display: 'flex', alignItems: 'center' },
    },
];

export const rowData = [
    {
        seqNo: '159',
        post: '결과 발표났는지 궁금합니다. 어디서 알 수 있는지요',
        writer: '최예다운',
        count: '3',
        state: '0',
        regDt: '2021-01-17',
    },
    {
        seqNo: '158',
        post: '결과 발표났는지 궁금합니다. 어디서 알 수 있는지요',
        writer: '최예다운',
        count: '3',
        state: '0',
        regDt: '2021-01-17',
    },
    {
        seqNo: '157',
        post: '결과 발표났는지 궁금합니다. 어디서 알 수 있는지요',
        writer: '최예다운',
        count: '3',
        state: '0',
        regDt: '2021-01-17',
    },
    {
        seqNo: '156',
        post: '결과 발표났는지 궁금합니다. 어디서 알 수 있는지요',
        writer: '최예다운',
        count: '3',
        state: '0',
        regDt: '2021-01-17',
    },
    {
        seqNo: '155',
        post:
            '2월 18일 당첨자 발표 예정이라고 하셨는데 오늘 2월 28일 인데 당선자 확정 됐나요. 다 봐도 우리만큼 할아버지와 손주가 닮은 사람은 없는 것 같은데... 담장 좀 주세요,, 결과를',
        writer: 'Michelle',
        count: '3',
        state: '0',
        regDt: '2021-01-17',
    },
    {
        seqNo: '154',
        post: '결과 발표났는지 궁금합니다. 어디서 알 수 있는지요',
        writer: '최예다운',
        count: '3',
        state: '0',
        regDt: '2021-01-17',
    },
];

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
