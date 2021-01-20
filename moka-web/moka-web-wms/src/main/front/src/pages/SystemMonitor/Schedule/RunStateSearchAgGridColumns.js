import React from 'react';
import RunStateDescRenderer from './components/RunStateDescRenderer';
import RunStateDtRenderer from './components/RunStateDtRenderer';
import RunStateErrorRenderer from './components/RunStateErrorRenderer';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        cellStyle: { fontSize: '12px' },
        width: 50,
    },
    {
        headerName: '분류',
        field: 'group',
        cellStyle: { fontSize: '12px' },
        width: 60,
    },
    {
        headerName: '주기',
        field: 'cycle',
        cellStyle: { fontSize: '12px' },
        width: 60,
    },
    {
        headerName: 'URL / 배포 경로 / 설명',
        field: 'content',
        cellStyle: { lineHeight: '18px', height: '60px' },
        autoHeight: true,
        flex: 1,
        cellRendererFramework: (row) => <RunStateDescRenderer {...row} />,
    },
    {
        headerName: '결과/시간(ms)',
        field: 'stateDt',
        cellStyle: { fontSize: '12px' },
        width: 100,
        cellRendererFramework: (row) => <RunStateDtRenderer {...row} />,
    },
    {
        headerName: '마지막 실행 정보',
        field: 'lastInfo',
        cellStyle: { fontSize: '12px' },
        width: 150,
        cellRendererFramework: (row) => <RunStateErrorRenderer {...row} />,
        tooltipField: 'error',
    },
];

export const rowData = [
    {
        seqNo: '146',
        group: '중앙4',
        cycle: '1분',
        url: 'http://gen.joins.com/joongang/rss/make_news_rss/ctg/11',
        route: '=>{ND@192.168.71.232}CMS_rss.joins.comjoins_money_list.xml',
        desc: '[JOINS 뉴스 RSS 생성]',
        create: '200/0',
        distribute: '-1/0',
        lastDt: '2020-01-06 15:20:22',
        error: 'FTP 접속 오류로 배포 실패 FTP 접속 오류로 배포 실패 FTP 접속 오류로 배포 실패 FTP 접속 오류로 배포 실패',
    },
    {
        seqNo: '145',
        group: '기타1',
        cycle: '1시간',
        url: 'http://iserver.joins.com/webbulk/kbcard/article_list/JA',
        route: '=> {FTP@ftp.static.joins.com}/data/bulk/kbcard/JA.xml',
        desc: '[[KB카드]중앙일보 골프 데이터]',
        create: '200/78',
        distribute: '0/94',
        lastDt: '2020-01-06 15:00:00',
        error: null,
    },
];
