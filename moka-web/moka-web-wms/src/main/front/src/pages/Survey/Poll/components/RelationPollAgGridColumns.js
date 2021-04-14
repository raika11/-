import { GRID_LINE_HEIGHT } from '@/style_constants';
import RelationPollAddBtn from './RelationPollAddBtn';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const columnDefs = [
    {
        headerName: '',
        field: 'add',
        width: 60,
        cellRendererFramework: RelationPollAddBtn,
    },
    {
        headerName: 'ID',
        field: 'id',
        width: 50,
        cellStyle,
    },
    {
        headerName: '그룹',
        field: 'group',
        width: 70,
        cellStyle,
    },
    {
        headerName: '투표 제목',
        field: 'title',
        width: 70,
        flex: 1,
        tooltipField: 'title',
        cellStyle,
    },
    {
        headerName: '상태',
        field: 'status',
        width: 50,
        cellStyle,
    },
];
