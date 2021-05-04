import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.T[2]}px`,
};

const columnDefs = [
    {
        headerName: 'No',
        field: 'scbNo',
        width: 50,
        tooltipField: 'scbNo',
        cellStyle,
    },
    {
        headerName: '구분',
        field: 'recomScb',
        width: 63,
        sortable: true,
        comparator: () => 0,
        cellStyle,
    },
    {
        headerName: '상품명',
        field: 'scbName',
        flex: 1,
        cellRenderer: 'longTextRenderer',
        tooltipField: 'scbName',
        sortable: true,
        comparator: () => 0,
    },
    {
        headerName: '구독방법',
        field: 'scbMethod',
        width: 120,
        cellRenderer: 'longTextRenderer',
    },
    {
        headerName: '대표여부',
        field: 'mainYn',
        cellRenderer: 'usedYnRenderer',
        width: 58,
    },
    {
        headerName: '개시일',
        field: 'startDt',
        width: 120,
        sortable: true,
        comparator: () => 0,
        cellStyle,
    },
    {
        headerName: '구독수',
        field: 'scbCnt',
        width: 63,
        cellStyle,
    },
    {
        headerName: '등록자\n등록일',
        width: 120,
        field: 'regInfo',
        cellRenderer: 'longTextRenderer',
        cellClass: 'ag-pre-cell',
        sortable: true,
        comparator: () => 0,
    },
    { headerName: '최종 수정일', width: 120, field: 'modDt', cellClass: 'ag-center-cell', sortable: true, comparator: () => 0 },
    {
        headerName: '상태',
        width: 63,
        field: 'statusText',
        cellClass: 'ag-center-cell',
        sortable: true,
        comparator: () => 0,
    },
];

export default columnDefs;

export const histColumnDefs = [
    {
        headerName: 'No',
        field: 'seqNo',
        width: 50,
        tooltipField: 'seqNo',
    },
    {
        headerName: '구분',
        field: 'field1',
        width: 63,
    },
    {
        headerName: '변경일시',
        field: 'field2',
        width: 120,
    },
    {
        headerName: '변경사유',
        field: 'field3',
        flex: 1,
    },
    {
        headerName: '작업자',
        field: 'field4',
        width: 120,
    },
];
