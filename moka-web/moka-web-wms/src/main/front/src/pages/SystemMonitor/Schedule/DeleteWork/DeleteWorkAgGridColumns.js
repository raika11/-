import React from 'react';
import WorkDescRenderer from '../components/WorkDescRenderer';
import WorkDelRenderer from '../components/WorkDelRenderer';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        width: 45,
    },
    {
        headerName: '분류',
        field: 'group',
        width: 50,
    },
    {
        headerName: '주기',
        field: 'cycle',
        width: 50,
    },
    {
        headerName: 'URL / 배포 경로 / 설명',
        field: 'content',
        cellStyle: { lineHeight: '18px', height: '60px' },
        autoHeight: true,
        flex: 1,
        cellRendererFramework: (row) => <WorkDescRenderer {...row} />,
    },
    {
        headerName: '삭제 정보',
        field: 'info',
        width: 240,
        cellRendererFramework: (row) => <WorkDelRenderer {...row} />,
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
        deploy: '-1/0',
        lastDt: '2020-01-06 15:20:22',
        error: 'FTP 접속 오류로 배포 실패 FTP 접속 오류로 배포 실패 FTP 접속 오류로 배포 실패 FTP 접속 오류로 배포 실패',
        regDt: '2019-10-19 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: '2020-01-20 10:04',
        modAdmin: '관리자1(admin1)',
        usedYn: 'Y',
        delDt: '2019-10-19 10:05',
        delAdmin: '관리자1(admin1)',
    },
];
