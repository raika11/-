import React from 'react';
import ListDeleteButton from './ListDeleteButton';
import ListEditButton from './ListEditButton';

const cellClassRules = {
    // 'desking-rel-row-cell': (params) => params.data.rel === true,
    'desking-edit-cell': (params) => params.colDef.editable
};

export const rowClassRules = {
    'ag-rel-row': (params) => params.data.rel === true
};

export const columnDefs = [
    {
        rowDrag: true,
        width: 22,
        suppressMenu: true,
        cellClassRules: cellClassRules
    },
    {
        field: 'relContentsOrder',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 2 : 1;
        },
        cellClassRules: cellClassRules
    },
    {
        colId: 'checkbox',
        width: 25,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellClassRules: cellClassRules
    },
    {
        field: 'relTitle',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 4 : 1;
        },
        editable: true,
        cellClassRules: cellClassRules
    },
    {
        field: 'contentsOrder',
        width: 23,
        cellClassRules: cellClassRules
    },
    {
        field: 'thumbnail',
        cellClass: 'align-center',
        width: 50,
        // cellStyle: {
        //     display: 'flex',
        //     alignItems: 'center',
        //     justifyContent: 'center'
        // },
        cellRenderer: (params) => {
            let tag = '';
            if (params.data.thumbnailFileName) {
                tag +=
                    '<span style="width: 50px; height: 48px; display: flex; align-items: center; background-color: #F4F7F9;">';
                tag += `<img width="50" src="https://pds.joins.com/${params.data.thumbnailFileName}" />`;
                tag += '</span>';
            }
            return tag;
        },
        cellClassRules: cellClassRules
    },
    {
        field: 'title',
        width: 300,
        autoHeight: true,
        editable: true,
        cellRendererFramework: (params) => {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '50px',
                        lineHeight: 'normal',
                        backgroundColor: '#F4F7F9',
                        width: '280px'
                    }}
                    dangerouslySetInnerHTML={{ __html: params.data.title }}
                />
            );
        },
        cellClassRules: cellClassRules
    },
    {
        field: 'editButton',
        width: 35,
        cellRendererFramework: ListEditButton,
        cellRendererParams: (params) => {
            return {
                api: params.api,
                rowIndex: params.rowIndex,
                colKey: 'title',
                char: params.data.title
            };
        },
        cellClassRules: cellClassRules
    },
    {
        field: 'deleteButton',
        width: 35,
        cellRendererFramework: ListDeleteButton,
        cellRendererParams: (params) => {
            return {
                name: 'delete',
                params
            };
        },
        cellClassRules: cellClassRules
    }
];

export const rowData = [
    {
        contentsId: '1',
        title: '더불어민주당 김현권 구미을 후보, 선거사무소 온라인 개소식',
        thumbnailFileName:
            '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentsOrder: '01'
    },
    {
        contentsId: '11',
        relTitle: 'rel"홍콩 글로벌 금융자본·인력… 인천 유치위해 규제 풀어야"',
        relThumbnailFileName: '',
        relContentsOrder: '01',
        rel: true
    },
    {
        contentsId: '12',
        relTitle: "rel'유치원 1년에 최소 5번 소독' 보고 규정은 全無",
        relThumbnailFileName: '',
        relContentsOrder: '02',
        rel: true
    },
    {
        contentsId: '2',
        title: '이상길 예비후보 "행정절차 간소화로 지역경제위기 막아야"',
        thumbnailFileName: '',
        contentsOrder: '02'
    },
    {
        contentsId: '3',
        title: "중앙지검 'n번방 사건' 특별수사 TF 구성",
        thumbnailFileName: '',
        contentsOrder: '03'
    },
    {
        contentsId: '4',
        title: '이차영 괴산군수 정부예산 확보 발품행정 이어져',
        thumbnailFileName:
            '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentsOrder: '04'
    },
    {
        contentsId: '5',
        title: '[★별자리운세] 2020년8월6일 (목요일) 동서양 별자리 타로운세',
        thumbnailFileName: '',
        contentsOrder: '05'
    }
];

// export const columnDefs = [
//     {
//         field: 'Files',
//         rowDrag: true,
//         minWidth: 300
//         // cellRendererParams: {
//         //     suppressCount: true,
//         //     innerRenderer: 'fileCellRenderer'
//         // },
//         // cellRenderer: (params) => {
//         //     let tempDiv = '';
//         //     let filename = params.data.filename;
//         //     let icon =
//         //         filename.endsWith('.mp3') || filename.endsWith('.wav')
//         //             ? 'far fa-file-audio'
//         //             : filename.endsWith('.xls')
//         //             ? 'far fa-file-excel'
//         //             : filename.endsWith('.txt')
//         //             ? 'far fa-file'
//         //             : filename.endsWith('.pdf')
//         //             ? 'far fa-file-pdf'
//         //             : 'far fa-folder';
//         //     tempDiv = icon
//         //         ? '<i class="' + icon + '"/>' + '<span class="filename">' + filename + '</span>'
//         //         : filename;
//         //     return tempDiv;
//         // }
//     },
//     { field: 'dateModified' },
//     {
//         field: 'size',
//         valueFormatter: (params) => (params.value ? params.value + ' MB' : '')
//     }
// ];

// export const rowData = [
//     {
//         id: 1,
//         filePath: ['Documents'],
//         filename: 'Documents',
//         type: 'folder'
//     },
//     {
//         id: 2,
//         filePath: ['Documents', 'txt'],
//         filename: 'txt',
//         type: 'folder'
//     },
//     {
//         id: 3,
//         filePath: ['Documents', 'txt', 'notes.txt'],
//         filename: 'notes.txt',
//         type: 'file',
//         dateModified: 'May 21 2017 01:50:00 PM',
//         size: 14.7
//     },
//     {
//         id: 4,
//         filePath: ['Documents', 'pdf'],
//         filename: 'pdf',
//         type: 'folder'
//     },
//     {
//         id: 5,
//         filePath: ['Documents', 'pdf', 'book.pdf'],
//         filename: 'book.pdf',
//         type: 'file',
//         dateModified: 'May 20 2017 01:50:00 PM',
//         size: 2.1
//     },
//     {
//         id: 6,
//         filePath: ['Documents', 'pdf', 'cv.pdf'],
//         filename: 'cv.pdf',
//         type: 'file',
//         dateModified: 'May 20 2016 11:50:00 PM',
//         size: 2.4
//     },
//     {
//         id: 7,
//         filePath: ['Documents', 'xls'],
//         filename: 'xls',
//         type: 'folder'
//     },
//     {
//         id: 8,
//         filePath: ['Documents', 'xls', 'accounts.xls'],
//         filename: 'accounts.xls',
//         type: 'file',
//         dateModified: 'Aug 12 2016 10:50:00 AM',
//         size: 4.3
//     },
//     {
//         id: 9,
//         filePath: ['Documents', 'stuff'],
//         filename: 'stuff',
//         type: 'folder'
//     },
//     {
//         id: 10,
//         filePath: ['Documents', 'stuff', 'xyz.txt'],
//         filename: 'xyz.txt',
//         type: 'file',
//         dateModified: 'Jan 17 2016 08:03:00 PM',
//         size: 1.1
//     },
//     {
//         id: 11,
//         filePath: ['Music'],
//         filename: 'Music',
//         type: 'folder'
//     },
//     {
//         id: 12,
//         filePath: ['Music', 'mp3'],
//         filename: 'mp3',
//         type: 'folder'
//     },
//     {
//         id: 13,
//         filePath: ['Music', 'mp3', 'theme.mp3'],
//         filename: 'theme.mp3',
//         type: 'file',
//         dateModified: 'Sep 11 2016 08:03:00 PM',
//         size: 14.3
//     },
//     {
//         id: 14,
//         filePath: ['Misc'],
//         filename: 'Misc',
//         type: 'folder'
//     },
//     {
//         id: 15,
//         filePath: ['Misc', 'temp.txt'],
//         filename: 'temp.txt',
//         type: 'file',
//         dateModified: 'Aug 12 2016 10:50:00 PM',
//         size: 101
//     }
// ];
