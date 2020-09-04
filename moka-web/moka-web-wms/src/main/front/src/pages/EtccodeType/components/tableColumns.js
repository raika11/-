import React from 'react';
import EtccodeTypeUpdateButton from './EtccodeTypeUpdateButton';

const tableColumns = [
    {
        id: 'codeTypeName',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '기타코드',
        width: 210,
        align: 'left',
        component: (row) => <EtccodeTypeUpdateButton row={row} />
    }
];

export default tableColumns;

export const rightTableColumns = [
    {
        id: 'codeTypeId',
        format: '',
        sort: false,
        disablePadding: true,
        label: '코드그룹',
        width: 140,
        align: 'center'
    },
    {
        id: 'codeId',
        format: '',
        sort: false,
        disablePadding: true,
        label: '코드',
        width: 220,
        align: 'center'
    },
    {
        id: 'codeName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '코드명',
        width: 155,
        align: 'center'
    },
    {
        id: 'etcOne',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기타1',
        width: 260,
        align: 'center'
    },
    {
        id: 'etcTwo',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기타2',
        width: 260,
        align: 'center'
    },
    {
        id: 'etcThree',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기타3',
        width: 260,
        align: 'center'
    },
    {
        id: 'codeOrder',
        format: '',
        sort: false,
        disablePadding: true,
        label: '순서',
        width: 60,
        align: 'center'
    },
    {
        id: 'useYn',
        format: '',
        sort: false,
        disablePadding: true,
        label: '사용여부',
        width: 70,
        align: 'center'
    }
];
