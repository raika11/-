import React from 'react';
import ComponentDeleteButton from './ComponentDeleteButton';
import ComponentLaunchButton from './ComponentLaunchButton';
import ComponentPreviewButton from './ComponentPreviewButton';
import ComponentOpenInNewButton from './ComponentOpenInNewButton';

/** 컴포넌트 테이블 컬럼 */
const tableColumns = [
    {
        id: 'componentSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 50,
        align: 'center'
    },
    {
        id: 'componentName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '컴포넌트명',
        width: 220,
        align: 'left'
    },
    {
        id: 'tpZone',
        format: '',
        sort: false,
        disablePadding: true,
        label: '위치그룹',
        width: 85,
        align: 'center'
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ComponentDeleteButton row={row} />
    }
];

export default tableColumns;

/** 관련 > 히스토리 */
export const historyColumns = [
    {
        id: 'seq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'NO',
        width: 70,
        align: 'left'
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
        width: 80,
        align: 'center',
        component: (row) => <ComponentLaunchButton row={row} />
    }
];

/** 관련 > 페이지 */
export const pageColumns = [
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
        width: 256,
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
        component: (row) => <ComponentPreviewButton row={row} />
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ComponentOpenInNewButton row={row} />
    }
];

/** 관련 > 스킨 */
export const skinColumns = [
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
        id: 'seqName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '콘텐츠스킨명',
        width: 170,
        align: 'left'
    },
    {
        id: 'skinStyle',
        format: '',
        sort: false,
        disablePadding: true,
        label: '스타일',
        width: 100,
        align: 'center'
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ComponentPreviewButton row={row} />
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ComponentOpenInNewButton row={row} />
    }
];

/** 관련 > 컨테이너 */
export const containerColumns = [
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
        width: 256,
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
        component: (row) => <ComponentPreviewButton row={row} />
    },
    {
        id: 'actions',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 30,
        align: 'center',
        component: (row) => <ComponentOpenInNewButton row={row} />
    }
];
