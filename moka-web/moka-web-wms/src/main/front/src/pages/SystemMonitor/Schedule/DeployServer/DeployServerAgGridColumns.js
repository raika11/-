import React from 'react';
import WorkIpHostRenderer from '../components/WorkIpHostRenderer';
import WorkStateRenderer from '../components/WorkStateRenderer';

export default [
    {
        headerName: '번호',
        field: 'seqNo',
        cellStyle: { fontSize: '12px' },
        width: 45,
    },
    {
        headerName: '별칭',
        field: 'alias',
        cellStyle: { fontSize: '12px' },
        width: 180,
    },
    {
        headerName: 'IP / HOST',
        field: 'ipHost',
        cellStyle: { fontSize: '12px' },
        cellRendererFramework: (row) => <WorkIpHostRenderer {...row} />,
        flex: 1,
    },
    {
        headerName: '계정 정보',
        field: 'id',
        cellStyle: { fontSize: '12px' },
        width: 180,
    },
    {
        headerName: '등록 / 수정 정보',
        field: 'info',
        cellStyle: { fontSize: '12px', lineHeight: '18px', height: '40px' },
        width: 240,
        autoHeight: true,
        cellRendererFramework: (row) => <WorkStateRenderer {...row} />,
    },
];

export const rowData = [
    {
        seqNo: '347',
        alias: '공유_IP_71.232',
        ip: '192.168.71.232',
        host: null,
        id: 'ADAD_cmsFeeder',
        regDt: '2019-10-19 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: '2020-01-20 10:04',
        modAdmin: '관리자1(admin1)',
    },
    {
        seqNo: '346',
        alias: '공유_IP_71.218',
        ip: '192.168.71.218',
        host: null,
        id: 'ADAD_cmsFeeder',
        regDt: '2019-08-19 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: null,
        modAdmin: null,
    },
    {
        seqNo: '345',
        alias: 'FTP_JOONGANG_JOINS',
        ip: null,
        host: 'ftp.news.joins.com/',
        id: 'joongang',
        regDt: '2019-08-07 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: null,
        modAdmin: null,
    },
    {
        seqNo: '344',
        alias: 'FTP_STATIC_JOINS',
        ip: null,
        host: 'ftp.static.joins.com/',
        id: 'staticup2',
        regDt: '2019-06-19 10:05',
        regAdmin: '관리자1(admin1)',
        modDt: null,
        modAdmin: null,
    },
];
