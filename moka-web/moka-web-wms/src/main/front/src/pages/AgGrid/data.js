import React from 'react';
import ListDeleteButton from './ListDeleteButton';
import ListEditButton from './ListEditButton';

const cellClassRules = {
    'ag-rel-cell': (params) => params.data.rel === true,
    'ag-edit-cell': (params) => params.colDef.editable
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
        // autoHeight: true,
        editable: true,
        wrapText: true,
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
        seq: '1',
        title: '더불어민주당 김현권 구미을 후보, 선거사무소 온라인 개소식',
        thumbnailFileName:
            '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentsOrder: '01',
        relSeqs: ['11', '12']
    },
    {
        contentsId: '11',
        seq: '11',
        relTitle: 'rel"홍콩 글로벌 금융자본·인력… 인천 유치위해 규제 풀어야"',
        relThumbnailFileName: '',
        relContentsOrder: '01',
        parentSeq: '1',
        rel: true,
        rowHeight: 42
    },
    {
        contentsId: '12',
        seq: '12',
        relTitle: "rel'유치원 1년에 최소 5번 소독' 보고 규정은 全無",
        relThumbnailFileName: '',
        relContentsOrder: '02',
        parentSeq: '1',
        rel: true,
        rowHeight: 42
    },
    {
        contentsId: '2',
        seq: '2',
        title: '이상길 예비후보 "행정절차 간소화로 지역경제위기 막아야"',
        thumbnailFileName: '',
        contentsOrder: '02'
    },
    {
        contentsId: '3',
        seq: '3',
        title: "중앙지검 'n번방 사건' 특별수사 TF 구성",
        thumbnailFileName: '',
        contentsOrder: '03'
    },
    {
        contentsId: '4',
        seq: '4',
        title: '이차영 괴산군수 정부예산 확보 발품행정 이어져',
        thumbnailFileName:
            '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentsOrder: '04',
        relSeqs: ['41', '42']
    },
    {
        contentsId: '41',
        seq: '41',
        relTitle: 'rel"홍콩 글로벌 금융자본·인력… 인천 유치위해 규제 풀어야"',
        relThumbnailFileName: '',
        relContentsOrder: '01',
        rel: true,
        rowHeight: 42
    },
    {
        contentsId: '42',
        seq: '42',
        relTitle: "rel'유치원 1년에 최소 5번 소독' 보고 규정은 全無",
        relThumbnailFileName: '',
        relContentsOrder: '02',
        rel: true,
        rowHeight: 42
    },
    {
        contentsId: '5',
        seq: '5',
        title: '[★별자리운세] 2020년8월6일 (목요일) 동서양 별자리 타로운세',
        thumbnailFileName: '',
        contentsOrder: '05'
    }
];

// export const getOverIndex = (event, tgt) => {
//     debugger;
//     const elements = document.elementsFromPoint(event.clientX, event.clientY);
//     const agGridRow = elements.find((r) => r.classList.contains('ag-row'));
//     if (agGridRow) {
//         const idOfRow = agGridRow.getAttribute('row-id');
//         const rowNode = tgt.api.getRowNode(idOfRow);
//         console.log('idOfRow:'+idOfRow+',rowIndex:'+rowNode.rowIndex);
//         return rowNode.rowIndex;
//     }
//     return -1;
// };
