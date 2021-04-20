import { GRID_LINE_HEIGHT } from '@/style_constants';

const cellStyle = {
    lineHeight: `${GRID_LINE_HEIGHT.C[0]}px`,
};

export const boardColumnDefs = (data) => {
    const { titlePrefixNm1, titlePrefixNm2, fileYn, recomFlag, declareYn } = data;
    return [
        {
            headerName: '번호',
            field: 'number',
            cellStyle,
            width: 50,
        },
        titlePrefixNm1 && {
            headerName: titlePrefixNm1,
            field: 'titlePrefix1',
            cellStyle,
            width: 80,
            tooltipField: 'titlePrefix1',
        },
        titlePrefixNm2 && {
            headerName: titlePrefixNm2,
            field: 'titlePrefix2',
            cellStyle,
            width: 80,
            tooltipField: 'titlePrefix2',
        },
        {
            headerName: '제목',
            field: 'title',
            flex: 1,
            cellStyle,
            tooltipField: 'title',
        },
        {
            headerName: '등록자',
            field: 'regInfo',
            cellStyle,
            width: 100,
            tooltipField: 'regInfo',
        },
        {
            headerName: '작성일시',
            field: 'regDt',
            cellStyle,
            width: 120,
        },
        {
            headerName: '조회수',
            field: 'viewCnt',
            cellStyle,
            width: 50,
            tooltipField: 'viewCnt',
        },
        fileYn === 'Y' && {
            headerName: '첨부파일',
            field: 'fileItem',
            width: 60,
            cellRenderer: 'fileItemRenderer',
        },
        recomFlag === '1' && {
            headerName: '추천/비추천',
            field: 'recomInfo',
            cellStyle,
            width: 75,
            tooltipField: 'recomInfo',
        },
        recomFlag === '2' && {
            headerName: '추천',
            field: 'recomCnt',
            cellStyle,
            width: 50,
            tooltipField: 'recomCnt',
        },
        declareYn === 'Y' && {
            headerName: '신고',
            field: 'declareCnt',
            cellStyle,
            width: 50,
            tooltipField: 'declareCnt',
        },
        {
            headerName: '노출',
            field: 'noDel',
            width: 35,
            maxWidth: 35,
            cellRenderer: 'usedYnRenderer',
        },
    ].filter(Boolean);
};
