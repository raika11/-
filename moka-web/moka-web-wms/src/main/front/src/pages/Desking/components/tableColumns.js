import React from 'react';
import DeskingLaunchButton from './DeskingLaunchButton';

const tableColumns = [
    {
        id: 'id',
        format: '',
        sort: false,
        disablePadding: true,
        label: '',
        width: 140,
        align: 'left'
    }
];

/** 히스토리 그룹별 목록 테이블 컬럼 */
export const histGroupColumns = [
    {
        id: 'seq',
        format: '',
        sort: false,
        disabledPadding: true,
        label: 'NO',
        align: 'center',
        width: 50
    },
    {
        id: 'createYmdtText',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업일시',
        align: 'center',
        width: 130
    },
    {
        id: 'creator',
        format: '',
        sort: false,
        disablePadding: true,
        label: '작업자',
        align: 'center',
        width: 80
    },
    {
        id: 'componentName',
        format: '',
        sort: false,
        disablePadding: true,
        label: '컴포넌트명',
        align: 'left',
        width: 195
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

/** 히스토리 상세 테이블 컬럼 */
export const histDetailColums = [
    {
        id: 'contentsOrder',
        format: '',
        sort: false,
        disabledPadding: true,
        label: 'NO',
        align: 'center',
        width: 50
    },
    {
        id: 'contentsId',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기사ID',
        align: 'center',
        width: 150
    },
    {
        id: 'title',
        format: '',
        sort: false,
        disablePadding: true,
        label: '기사제목',
        align: 'left',
        width: 264
    }
];

export default tableColumns;
