import React from 'react';
import TemplateDeleteButton from './TemplateDeleteButton';
import TemplateLaunchButton from './TemplateLaunchButton';
import TemplatePreviewButton from './TemplatePreviewButton';
import TemplateOpenInNewButton from './TemplateOpenInNewButton';
import { DomainPlatformIcon } from '~/components';

// 템플릿 리스트 컬럼
const tableColumns = [
    {
        id: 'templateSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 50,
        align: 'center'
    },
    {
        id: 'templateName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '템플릿명',
        width: 160,
        align: 'left'
    },
    {
        id: 'tpZone',
        format: '',
        sort: false,
        disablePadding: true,
        label: '위치그룹',
        width: 93,
        align: 'center'
    },
    {
        id: 'templateWidth',
        format: '',
        sort: false,
        disablePadding: true,
        label: '사이즈',
        width: 50,
        align: 'center'
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'left',
        component: (row) => <TemplateDeleteButton row={row} />
    }
];
export default tableColumns;

// 템플릿 히스토리 컬럼
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
        width: 150,
        align: 'center'
    },
    {
        id: 'creator',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업자',
        width: 100,
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
        component: (row) => <TemplateLaunchButton row={row} />
    }
];

// 템플릿 관련 페이지 컬럼
export const pageColumns = [
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
        id: 'pageSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 60,
        align: 'center'
    },
    {
        id: 'pageName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '페이지명',
        width: 178,
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
        component: (row) => <TemplatePreviewButton row={row} />
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <TemplateOpenInNewButton row={row} />
    }
];

// 템플릿 관련 스킨 컬럼
export const skinColumns = [
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
        id: 'skinName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '스킨명',
        width: 140,
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
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <TemplatePreviewButton row={row} />
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <TemplateOpenInNewButton row={row} />
    }
];

// 템플릿 관련 컨테이너 컬럼
export const containerColumns = [
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
        width: 198,
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
        component: (row) => <TemplateOpenInNewButton row={row} />
    }
];

// 템플릿 관련 컴포넌트 컬럼
export const componentColumns = [
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
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <TemplateOpenInNewButton row={row} />
    }
];
