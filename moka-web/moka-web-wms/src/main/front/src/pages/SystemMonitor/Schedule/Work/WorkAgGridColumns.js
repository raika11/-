import React from 'react';
import { MokaIcon } from '@/components';
import WorkDescRenderer from '../components/WorkDescRenderer';
import WorkStateRenderer from '../components/WorkStateRenderer';

export default [
    {
        headerName: '',
        field: 'usedYn',
        cellStyle: { fontSize: '12px', textAlign: 'center' },
        width: 36,
        cellRendererFramework: (params) => {
            const { usedYn } = params.data;
            let color = usedYn === 'Y' ? 'color-primary' : 'color-gray150';
            return <MokaIcon iconName="fas-circle" fixedWidth className={color} />;
        },
    },
    {
        headerName: '번호',
        field: 'seqNo',
        cellStyle: { fontSize: '12px' },
        width: 45,
    },
    {
        headerName: '분류',
        field: 'group',
        cellStyle: { fontSize: '12px' },
        width: 50,
    },
    {
        headerName: '주기',
        field: 'cycle',
        cellStyle: { fontSize: '12px' },
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
        headerName: '등록 / 수정 정보',
        field: 'info',
        cellStyle: { fontSize: '12px' },
        width: 240,
        cellRendererFramework: (row) => <WorkStateRenderer {...row} />,
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
    },
    {
        seqNo: '145',
        group: '기타1',
        cycle: '1시간',
        url: 'http://iserver.joins.com/webbulk/kbcard/article_list/JA',
        route: '=> {FTP@ftp.static.joins.com}/data/bulk/kbcard/JA.xml',
        desc: '[[KB카드]중앙일보 골프 데이터]',
        create: '200/78',
        deploy: '0/94',
        lastDt: '2020-01-06 15:00:00',
        error: null,
        regDt: '2019-05-19 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: '2020-02-20 10:04',
        modAdmin: '관리자1(admin1)',
        usedYn: 'Y',
    },
    {
        seqNo: '144',
        group: '중앙1',
        cycle: '5분',
        url: 'http://gen.joins.com/joongang/AirkoreaMesure/getCtprvnMesureList/',
        route: '=> {0@}',
        desc: '[대기정보 조회(미세먼지,오존등) 에어코리아 API호출]',
        create: '200/78',
        deploy: '0/94',
        lastDt: '2020-01-06 15:00:00',
        error: null,
        regDt: '2019-01-19 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: '2020-03-20 10:04',
        modAdmin: '관리자1(admin1)',
        usedYn: 'N',
    },
];
