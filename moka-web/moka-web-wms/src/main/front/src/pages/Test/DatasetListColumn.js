import React from 'react';
import DatasetListDeleteButton from './DatasetListDeleteButton';
import { WmsThumbnailCard } from '~/components';

/**
 * 이미지 박스의 가로,세로(헤더,푸터 제외한 사이즈)
 */
export const boxWidth = 183;
export const boxHeight = 130;

/**
 * 목록에서 줄 높이
 */
// export const rowHeight = 51; // 두 줄
export const rowHeight = 32;

/**
 * 목록 이외의 높이
 */
export const otherHeight = 32;

/**
 * 컬럼정의
 */
export const datasetColumns = [
    // 체크박스
    // {
    //     id: 'datasetCheck',
    //     format: 'checkbox',
    //     sort: false,
    //     disablePadding: true,
    //     label: '',
    //     width: 52, // checkbox는 width가 먹히지 않음
    //     align: 'center'
    // },
    // 라디오
    {
        id: 'datasetRadio',
        format: 'radio',
        sort: false,
        disablePadding: true,
        label: '',
        width: 52, // radio는 width가 먹히지 않음
        align: 'center'
    },
    {
        id: 'datasetSeq',
        format: '',
        sort: false,
        disablePadding: true,
        label: '아이디',
        width: 60,
        align: 'center'
    },
    {
        id: 'datasetName',
        format: '',
        sort: true,
        disablePadding: true,
        label: '데이타셋명',
        width: 150,
        align: 'left'
    },
    // rowspan 두 줄 헤더
    // {
    //     id: 'datasetInfo',
    //     format: 'rowspan',
    //     sort: true,
    //     disablePadding: true,
    //     label: '',
    //     width: 300,
    //     align: 'left',
    //     list: [
    //         {
    //             id: 'datasetName',
    //             format: '',
    //             sort: true,
    //             disablePadding: true,
    //             label: '데이타셋명',
    //             width: 300,
    //             align: 'left'
    //         },
    //         {
    //             id: 'datasetSeq',
    //             format: '',
    //             sort: true,
    //             disablePadding: true,
    //             label: '아이디',
    //             width: 300,
    //             align: 'left'
    //         }
    //     ]
    // },
    {
        id: 'autoCreateYn',
        format: '',
        sort: false,
        disablePadding: true,
        label: '유형',
        width: 80,
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
        component: (row) => <DatasetListDeleteButton row={row} />
    }
];

export const datasetAgColumns = [
    {
        field: 'check',
        cellClass: 'align-center',
        headerName: '',
        width: 66,
        rowDrag: true,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        lockPosition: true,
        suppressNavigable: true
    },
    {
        field: 'datasetSeq',
        cellClass: 'align-center',
        headerName: 'ID',
        width: 66,
        lockPosition: true,
        suppressNavigable: true
    },
    {
        field: 'thumnnail',
        cellClass: 'align-center',
        headerName: '',
        width: 70,
        lockPosition: true,
        suppressNavigable: true,
        cellRendererFramework: WmsThumbnailCard,
        cellRendererParams: (params) => {
            return {
                width: 40,
                height: 40,
                onlyThumbnail: true,
                selected: false,
                img:
                    'https://dimg.donga.com/ugc/CDB/SHINDONGA/Article/5e/be/30/35/5ebe3035212fd2738de6.jpg'
                // params
            };
        }
    },
    {
        field: 'datasetName',
        cellClass: 'align-left',
        headerName: '데이터셋명',
        width: 154,
        lockPosition: true,
        suppressNavigable: true
    },
    // {
    //     field: 'autoCreateYn',
    //     cellClass: 'align-center',
    //     headerName: '',
    //     width: 70,
    //     lockPosition: true,
    //     suppressNavigable: true
    // },
    {
        field: 'datasetDelete',
        cellClass: 'align-center',
        headerName: '',
        width: 50,
        lockPosition: true,
        suppressNavigable: true,
        cellRendererFramework: DatasetListDeleteButton
        // cellRenderer: 'datasetListDeleteButton'
        // cellRenderer: (params) => {
        //     return '<input name="selected" type="radio">';
        // }
    }
];
