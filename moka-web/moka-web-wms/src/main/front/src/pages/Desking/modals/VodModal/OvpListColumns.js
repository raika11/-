import { GRID_LINE_HEIGHT } from '@/style_constants';

export default [
    {
        colId: 'checkbox',
        width: 30,
        maxWidth: 30,
        checkboxSelection: true,
        suppressMenu: true,
    },
    {
        headerName: '이미지',
        width: 60,
        field: 'thumbFileName',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '제목',
        field: 'name',
        width: 186,
        flex: 1,
        tooltipField: 'name',
        cellRenderer: 'longTextRenderer',
        cellStyle: {
            cursor: 'pointer',
        },
    },
    {
        headerName: '상태',
        field: 'stateText',
        width: 40,
        cellClassRules: {
            'ag-center-cell': () => true,
        },
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 83,
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '옵션',
        colId: 'options',
        width: 83,
        cellRenderer: 'optionRenderer',
        cellStyle: {
            lineHeight: `${GRID_LINE_HEIGHT.M}px`,
        },
        // valueGetter: (params) => {
        //     debugger;
        //     return params.getValue();
        // },
    },
];
