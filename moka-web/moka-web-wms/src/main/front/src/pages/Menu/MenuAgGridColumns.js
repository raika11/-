import MokaTableUsedYnRenderer from '@components/MokaTable/MokaTableUsedYnRenderer';

export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };

export const columnDefs = [
    {
        rowDrag: true,
        width: 24,
        minWidth: 24,
        suppressMenu: true,
        rowDragText: (params) => {
            return params.rowNode.data.menuDisplayNm;
        },
    },
    {
        headerName: '번호',
        field: 'menuSeq',
        width: 50,
        cellStyle: { lineHeight: '34px' },
    },
    {
        headerName: '메뉴명',
        field: 'menuDisplayNm',
        width: 140,
        flex: 1,
        cellStyle: { lineHeight: '34px', cursor: 'pointer' },
    },
    {
        headerName: '',
        field: 'usedYn',
        width: 38,
        cellRendererFramework: MokaTableUsedYnRenderer,
    },
];
