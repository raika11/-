import React from 'react';
import Image from 'react-bootstrap/Image';
import ReporterModalAddButton from '../components/ReporterModalAddButton';

import bg from '@assets/images/bg.jpeg';
import PropTypes from 'prop-types';

export const columnDefs = [
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
        headerName: '번호',
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
            return <Image {...row} width="35" height="35" src={bg} data={data} roundedCircle />;
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
        field: 'jamDeptNm',
        cellStyle: { fontSize: '12px' },
        width: 130,
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
        width: 180,
    },
];

export const rowData = [
    {
        repSeq: 1000,
        joinsId: 'Richards',
        repName: '강기헌',
        jamDeptNm: '편집국',
        repTitle: '논설위원',
        repEmail1: 'crutis@test.com',
    },
];
