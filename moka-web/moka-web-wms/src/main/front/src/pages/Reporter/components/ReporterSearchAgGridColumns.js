import React from 'react';
import Image from 'react-bootstrap/Image';
import ReporterModalAddButton from './ReporterModalAddButton';

export default [
    {
        headerName: '',
        field: 'add',
        width: 70,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <ReporterModalAddButton {...row} onClick={data.onClickSave} data={data} />;
        },
    },
    {
        headerName: 'No',
        field: 'repSeq',
        cellStyle: { fontSize: '12px' },
        width: 90,
    },
    {
        headerName: '아이디',
        field: 'joinsId',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '사진',
        field: 'repImg',
        width: 100,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <Image width="40" height="40" src={data.repImg} data={data} roundedCircle />;
        },
    },
    {
        headerName: '이름',
        field: 'repName',
        cellStyle: { fontSize: '12px' },
        width: 100,
    },
    {
        headerName: '소속',
        field: 'belong',
        cellStyle: { fontSize: '12px' },
        width: 150,
    },
    {
        headerName: '직책',
        field: 'repTitle',
        cellStyle: { fontSize: '12px' },
        width: 150,
    },
    {
        headerName: '이메일',
        field: 'repEmail1',
        cellStyle: { fontSize: '12px' },
        width: 200,
    },
];
