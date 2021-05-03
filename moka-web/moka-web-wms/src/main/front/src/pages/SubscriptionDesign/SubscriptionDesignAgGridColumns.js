import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[2]}px`,
};

const columnDefs = [
    {
        headerName: 'No',
        field: 'seqNo',
        width: 50,
        tooltipField: 'seqNo',
        cellStyle,
    },
    {
        headerName: '구분',
        field: 'field1',
        width: 63,
        sortable: true,
        comparator: () => 0,
        cellStyle,
    },
    {
        headerName: '상품명',
        field: 'field2',
        flex: 1,
        cellRenderer: 'longTextRenderer',
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: '구독방법',
        field: 'field3',
        width: 120,
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '대표여부',
        cellRenderer: 'usedYnRenderer',
        field: 'field4',
        width: 58,
    },
    {
        headerName: '게시일',
        field: 'field5',
        width: 120,
        sortable: true,
        comparator: () => 0,
        cellStyle,
    },
    {
        headerName: '구독수',
        field: 'field6',
        width: 63,
        cellStyle,
    },
    {
        headerName: '등록자\n등록일',
        width: 120,
        field: 'field7',
        cellRenderer: 'longTextRenderer',
        cellClass: 'ag-pre-cell',
        sortable: true,
        comparator: () => 0,
    },
    { headerName: '최종 수정일', width: 120, field: 'field8', cellClass: 'ag-center-cell', sortable: true, comparator: () => 0 },
    {
        headerName: '상태',
        width: 63,
        field: 'field9',
        cellClass: 'ag-center-cell',
        sortable: true,
        comparator: () => 0,
    },
];

export default columnDefs;
