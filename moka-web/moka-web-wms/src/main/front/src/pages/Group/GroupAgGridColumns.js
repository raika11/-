export const localeText = { noRowsToShow: '조회 결과가 없습니다.', loadingOoo: '조회 중입니다..' };
const cellClassRules = { 'ft-12': () => true };

export const columnDefs = [
    {
        headerName: '그룹코드',
        field: 'groupCd',
        // cellStyle: { textAlign: 'center' },
        width: 65,
        tooltipField: 'groupCd',
        cellClassRules,
    },
    {
        headerName: '그룹명',
        field: 'groupNm',
        // cellClass: 'ag-cell-center',
        //cellStyle: { textAlign: 'center' },
        width: 75,
        flex: 1,
        tooltipField: 'groupNm',
        cellClassRules,
    },
    {
        headerName: '그룹 한글명',
        field: 'groupKorNm',
        //cellStyle: { textAlign: 'center' },
        flex: 1,
        width: 95,
        tooltipField: 'groupKorNm',
        cellClassRules,
    },
    {
        headerName: '등록자',
        field: 'regId',
        width: 65,
        tooltipField: 'regId',
        cellClassRules,
    },
    {
        headerName: '등록일시',
        field: 'regDt', // 안나옴.
        width: 110,
        cellClassRules,
    },
];
