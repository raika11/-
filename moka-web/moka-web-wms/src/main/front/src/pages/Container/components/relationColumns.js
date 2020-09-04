import React from 'react';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import ContainerLaunchButton from './ContainerLaunchButton';
import { WmsIconButton } from '~/components';
import AppendTagButton from './AppendTagButton';

/**
 * 관련페이지 목록 컬럼
 */
export const pageSearchColumns = [
    {
        id: 'pageSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 56,
        align: 'center'
    },
    {
        id: 'pageName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '페이지명',
        width: 272,
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
                    window.open(`${row.pageUrlLink}`);
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
        id: 'skinSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 56,
        align: 'center'
    },
    {
        id: 'skinName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '콘텐츠스킨명',
        width: 162,
        align: 'left'
    },
    {
        id: 'styleName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '스타일',
        width: 110,
        align: 'center'
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
        width: 30,
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
 * 관련컨테이너 검색조건
 */
export const containerSearchTypes = [
    { id: 'containerSeq', name: '컨테이너ID' },
    { id: 'containerName', name: '컨테이너명' }
];

/**
 * 관련컨테이너 목록 컬럼
 */
export const containerSearchColumns = [
    {
        id: 'containerSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 56,
        align: 'center'
    },
    {
        id: 'containerName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '컨테이너명',
        width: 302,
        align: 'left'
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ContainerLaunchButton row={row} bHistory={false} />
    }
];

/**
 * 관련컴포넌트 검색조건
 */
export const componentSearchTypes = [
    { id: 'containerSeq', name: '컨테이너ID' },
    { id: 'componentSeq', name: '컴포넌트ID' },
    { id: 'componentName', name: '컴포넌트명' }
];

/**
 * 관련컴포넌트 목록 컬럼
 */
export const componentSearchColumns = [
    {
        id: 'componentSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 56,
        align: 'center'
    },
    {
        id: 'componentName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '컴포넌트명',
        width: 190,
        align: 'left'
    },
    {
        id: 'tpZone',
        format: '',
        sort: false,
        disablePadding: true,
        label: '위치그룹',
        width: 80,
        align: 'left'
    },
    {
        id: 'append',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <AppendTagButton itemType="cp" row={row} />
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
                    e.stopPropagation();
                    window.open(`/component/${row.componentSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];

/**
 * 관련템플릿 검색조건
 */
export const templateSearchTypes = [
    { id: 'containerSeq', name: '컨테이너ID' },
    // { id: 'all', name: '템플릿 전체' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' }
    // { id: 'templateBody', name: '템플릿본문' }
];

/**
 * 관련템플릿 목록 컬럼
 */
export const templateSearchColumns = [
    {
        id: 'templateSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 60,
        align: 'center'
    },
    {
        id: 'templateName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '템플릿명',
        width: 185,
        align: 'left'
    },
    {
        id: 'tpZone',
        format: '',
        sort: false,
        disablePadding: true,
        label: '위치그룹',
        width: 80,
        align: 'center'
    },
    {
        id: 'append',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <AppendTagButton itemType="tp" row={row} />
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
                    e.stopPropagation();
                    window.open(`/template/${row.templateSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];

/**
 * 관련광고 검색조건
 */
export const adSearchTypes = [
    { id: 'containerSeq', name: '컨테이너ID' },
    { id: 'adSeq', name: '광고ID' },
    { id: 'adName', name: '광고명' }
];

/**
 * 관련광고 목록 컬럼
 */
export const adSearchColumns = [
    {
        id: 'adSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 56,
        align: 'center'
    },
    {
        id: 'adName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '광고명',
        width: 272,
        align: 'left'
    },
    {
        id: 'append',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <AppendTagButton itemType="ad" row={row} />
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
                    e.stopPropagation();
                    window.open(`/ad/${row.adSeq}`);
                }}
            >
                <LaunchOutlinedIcon />
            </WmsIconButton>
        )
    }
];

/**
 * 히스토리 검색조건
 */
export const historySearchTypes = [
    { id: 'all', name: '전체' },
    { id: 'createYmdt', name: '날짜' },
    { id: 'creator', name: '작업자' }
];

/**
 * 히스토리 목록 컬럼
 */
export const historyColumns = [
    {
        id: 'seq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'NO',
        width: 70,
        align: 'center'
    },
    {
        id: 'createYmdt',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업일시',
        width: 160,
        align: 'center'
    },
    {
        id: 'creator',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업자',
        width: 88,
        align: 'center'
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '불러오기',
        width: 70,
        align: 'center',
        component: (row) => <ContainerLaunchButton row={row} />
    }
];
