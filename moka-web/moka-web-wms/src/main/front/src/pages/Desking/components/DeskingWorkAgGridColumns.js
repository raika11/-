import React from 'react';
import { MokaTableDeleteButton, MokaTableEditButton } from '@components';

const cellClassRules = {
    'ag-rel-cell': (params) => params.data.rel === true,
    'ag-edit-cell': (params) => params.colDef.editable,
};

export const rowClassRules = {
    'ag-rel-row': (params) => params.data.rel === true,
};

export const columnDefs = [
    {
        rowDrag: true,
        width: 16,
        suppressMenu: true,
        cellClassRules: cellClassRules,
    },
    {
        field: 'relOrd',
        width: 0,
        colSpan: (params) => {
            return params.data.rel ? 2 : 1;
        },
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        colId: 'checkbox',
        width: 16,
        checkboxSelection: true,
        suppressMenu: true,
        headerCheckboxSelection: true,
        cellClassRules: cellClassRules,
    },
    {
        width: 0,
        field: 'relTitle',
        colSpan: (params) => {
            return params.data.rel ? 4 : 1;
        },
        editable: true,
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 20,
        field: 'contentOrd',
        cellClassRules: cellClassRules,
        cellStyle: { fontSize: '12px' },
    },
    {
        width: 50,
        field: 'thumbFileName',
        cellRenderer: 'imageRenderer',
        cellClassRules: cellClassRules,
    },
    {
        width: 220,
        field: 'title',
        flex: 1,
        autoHeight: true,
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '12px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
        editable: true,
        wrapText: true,
        cellClassRules: cellClassRules,
    },
    {
        field: 'editButton',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableEditButton {...row} onClick={data.onDelete} />;
        },
        cellRendererParams: (params) => {
            return {
                api: params.api,
                rowIndex: params.rowIndex,
                colKey: 'title',
                char: params.data.title,
            };
        },
        cellClassRules: cellClassRules,
    },
    {
        field: 'deleteButton',
        width: 36,
        cellRendererFramework: (row) => {
            const { data } = row;
            return <MokaTableDeleteButton {...row} onClick={data.onDelete} />;
        },
        cellRendererParams: (params) => {
            return {
                name: 'delete',
                params,
            };
        },
        cellClassRules: cellClassRules,
    },
];

export const rowData = [
    {
        seq: '1',
        totalId: '1',
        title: '더불어민주당 김현권 구미을 후보, 선거사무소 온라인 개소식',
        relTitle: '',
        thumbnailFileName: '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentOrd: '01',
        relOrd: '',
        parentTotalId: null,
        rel: false,
        relSeqs: ['11', '12'],
    },
    {
        seq: '11',
        totalId: '11',
        title: '',
        relTitle: 'rel"홍콩 글로벌 금융자본·인력… 인천 유치위해 규제 풀어야"',
        thumbnailFileName: '',
        contentOrd: '',
        relOrd: '01',
        parentTotalId: '1',
        rel: true,
        relSeqs: null,
    },
    {
        seq: '12',
        totalId: '12',
        title: '',
        relTitle: "rel'유치원 1년에 최소 5번 소독' 보고 규정은 全無",
        thumbnailFileName: '',
        contentOrd: '',
        relOrd: '02',
        parentTotalId: '1',
        rel: true,
        relSeqs: null,
    },
    {
        seq: '2',
        totalId: '2',
        title: '이상길 예비후보 "행정절차 간소화로 지역경제위기 막아야"',
        relTitle: '',
        thumbnailFileName: '',
        contentOrd: '02',
        relOrd: '',
        parentTotalId: null,
        rel: false,
        relSeqs: null,
    },
    {
        seq: '3',
        totalId: '3',
        title: "중앙지검 'n번방 사건' 특별수사 TF 구성",
        relTitle: '',
        thumbnailFileName: '',
        contentOrd: '03',
        relOrd: '',
        parentTotalId: null,
        rel: false,
        relSeqs: null,
    },
    {
        seq: '4',
        totalId: '4',
        title: '이차영 괴산군수 정부예산 확보 발품행정 이어져',
        relTitle: '',
        thumbnailFileName: '/news/component/htmlphoto_mmdata/202009/18/c57ae87f-08af-4111-89e5-325406b1477d.jpg',
        contentOrd: '04',
        relOrd: '',
        parentTotalId: null,
        rel: false,
        relSeqs: ['41', '42'],
    },
    {
        seq: '41',
        totalId: '41',
        title: '',
        relTitle: 'rel"홍콩 글로벌 금융자본·인력… 인천 유치위해 규제 풀어야"',
        thumbnailFileName: '',
        contentOrd: '',
        relOrd: '01',
        parentTotalId: '4',
        rel: true,
        relSeqs: null,
    },
    {
        seq: '42',
        totalId: '42',
        title: '',
        relTitle: "rel'유치원 1년에 최소 5번 소독' 보고 규정은 全無",
        thumbnailFileName: '',
        contentOrd: '',
        relOrd: '02',
        parentTotalId: '4',
        rel: true,
        relSeqs: null,
    },
    {
        seq: '5',
        totalId: '5',
        title: '[★별자리운세] 2020년8월6일 (목요일) 동서양 별자리 타로운세',
        relTitle: '',
        thumbnailFileName: '',
        contentOrd: '05',
        relOrd: '',
        parentTotalId: null,
        rel: false,
        relSeqs: null,
    },
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
