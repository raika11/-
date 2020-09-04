import React from 'react';
import { WmsIconButton } from '~/components';
import { DeskingLaunchButton } from '../components';

/** 히스토리 다이얼로그 (왼쪽 그룹 테이블)  */
export const histGroupColums = [
    {
        id: 'seq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'NO',
        align: 'center',
        width: 40
    },
    {
        id: 'createYmdtText',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업일시',
        align: 'center',
        width: 140
    },
    {
        id: 'creator',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업자',
        align: 'center',
        width: 120
    },
    {
        id: '',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '불러오기',
        align: 'center',
        width: 60,
        component: (row, options) => <DeskingLaunchButton row={row} options={options} />
    }
];

/** 히스토리 다이얼로그 (오른쪽 상세 테이블) */
export const histDetailcolumns = [
    {
        id: 'contentsOrder',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'NO',
        width: 40,
        align: 'center'
    },
    {
        id: 'contentsId',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기사ID',
        width: 130,
        align: 'center'
    },
    {
        id: 'title',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기사제목',
        width: 266,
        align: 'left'
    }
];

/** 템플릿 목록 */
export const templateColumns = [
    {
        id: 'radio',
        format: 'radio',
        sort: false,
        disablePadding: true,
        label: '',
        width: 40,
        align: 'center'
    },
    {
        id: 'templateSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'ID',
        width: 70,
        align: 'center'
    },
    {
        id: 'templateName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '템플릿명',
        width: 286,
        align: 'left'
    },
    {
        id: 'tpZone',
        format: '',
        sort: false,
        disablePadding: true,
        label: '위치그룹',
        width: 120,
        align: 'center'
    },
    {
        id: 'templateWidth',
        format: '',
        sort: false,
        disablePadding: true,
        label: '사이즈',
        width: 70,
        align: 'center'
    },
    {
        id: '',
        format: 'component',
        sort: false,
        disablePadding: true,
        label: '',
        width: 40,
        align: 'center',
        component: (row) => {
            return (
                <WmsIconButton
                    icon="launch"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(row.link);
                    }}
                />
            );
        }
    }
];

export const myComponentLeftTableColumns = [
    {
        id: 'component',
        format: '',
        sort: false,
        disablePadding: true,
        label: '전체 컴포넌트',
        align: 'center'
    }
];

export const myComponentRightTableColumns = [
    {
        id: 'myComponent',
        format: '',
        sort: false,
        disablePadding: true,
        label: 'My컴포넌트',
        align: 'center'
    }
];

export const registerColumns = [
    {
        id: 'name',
        format: '',
        sort: false,
        disablePadding: true,
        label: '',
        width: 240,
        align: 'left'
    }
];
