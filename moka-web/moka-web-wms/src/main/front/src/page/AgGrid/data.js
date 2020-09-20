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
        title: '테스트 기사1',
        thumbnailFileName:
            '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentsOrder: '01'
    },
    {
        contentsId: '11',
        relTitle: '테스트 기사11',
        relThumbnailFileName: '',
        relContentsOrder: '01',
        rel: true
    },
    {
        contentsId: '12',
        relTitle: '테스트 기사12',
        relThumbnailFileName: '',
        relContentsOrder: '02',
        rel: true
    },
    {
        contentsId: '2',
        title: '테스트 기사2',
        thumbnailFileName: '',
        contentsOrder: '02'
    },
    {
        contentsId: '3',
        title: '테스트 기사3',
        thumbnailFileName: '',
        contentsOrder: '03'
    },
    {
        contentsId: '4',
        title: '테스트 기사4',
        thumbnailFileName:
            '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentsOrder: '04'
    },
    {
        contentsId: '5',
        title: '테스트 기사5',
        thumbnailFileName: '',
        contentsOrder: '05'
    }
];
