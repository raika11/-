import React from 'react';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import { WmsIconButton, DomainPlatformIcon } from '~/components';

/**
 * 관련페이지 목록 컬럼
 */
export const pageSearchColumns = [
    {
        id: 'platform',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '도메인',
        width: 90,
        align: 'center',
        component: (row) => <DomainPlatformIcon row={row} />
    },
    {
        id: 'pageSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 70,
        align: 'center'
    },
    {
        id: 'pageName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '페이지명',
        width: 168,
        align: 'left'
    },
    {
        id: 'preview',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => (
            <WmsIconButton
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`${row.pageUrl}`);
                }}
            >
                <PageviewOutlinedIcon />
            </WmsIconButton>
        )
    },
    {
        id: 'detailGo',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => (
            <WmsIconButton
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`/page/${row.pageSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];

/**
 * 관련콘텐츠스킨 목록 컬럼
 */
export const skinSearchColumns = [
    {
        id: 'platform',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '도메인',
        width: 90,
        align: 'left',
        component: (row) => <DomainPlatformIcon row={row} />
    },
    {
        id: 'skinSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 70,
        align: 'center'
    },
    {
        id: 'skinName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '콘텐츠스킨명',
        width: 130,
        align: 'left'
    },
    {
        id: 'skinStyle',
        format: '',
        sort: false,
        disablePadding: true,
        label: '스타일',
        width: 90,
        align: 'left'
    },
    {
        id: 'preview',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => (
            <WmsIconButton
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`${row.previewUrl}`);
                }}
            >
                <PageviewOutlinedIcon />
            </WmsIconButton>
        )
    },
    {
        id: 'detailGo',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 50,
        align: 'center',
        component: (row) => (
            <WmsIconButton
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`/skin/${row.skinSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];

/**
 * 관련컨테이너 목록 컬럼
 */
export const containerSearchColumns = [
    {
        id: 'platform',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '도메인',
        width: 90,
        align: 'left',
        component: (row) => <DomainPlatformIcon row={row} />
    },
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
        width: 190,
        align: 'left'
    },
    {
        id: 'detailGo',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 198,
        align: 'center',
        component: (row) => (
            <WmsIconButton
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`/container/${row.containerSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];

/**
 * 관련컴포넌트 목록 컬럼
 */
export const componentSearchColumns = [
    {
        id: 'platform',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '도메인',
        width: 90,
        align: 'left',
        component: (row) => <DomainPlatformIcon row={row} />
    },
    {
        id: 'componentSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 70,
        align: 'center'
    },
    {
        id: 'componentName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '컴포넌트명',
        width: 198,
        align: 'left'
    },
    {
        id: 'detailPop',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => (
            <WmsIconButton
                onClick={(e) => {
                    e.preventDefault();
                    window.open(`/component/${row.componentSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];
