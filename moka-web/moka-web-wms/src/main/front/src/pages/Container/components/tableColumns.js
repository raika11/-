import React from 'react';
import ContainerListDeleteButton from './ContainerListDeleteButton';

/**
 * 컨테이너 검색조건
 */
export const tableSearchTypes = [
    { id: 'all', name: '전체' },
    { id: 'containerSeq', name: '컨테이너ID' },
    { id: 'containerName', name: '컨테이너명' },
    { id: 'containerBody', name: '본문' }
];

/**
 * 컨테이너 목록 컬럼
 */
export const tableColumns = [
    {
        id: 'containerSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 70,
        align: 'center'
    },
    {
        id: 'containerName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '컨테이너명',
        width: 285,
        align: 'left'
    },
    {
        id: 'containerDelete',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ContainerListDeleteButton row={row} />
    }
];
