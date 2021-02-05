import PostSelectRenderer from './components/PostSelectRenderer';

export default [
    {
        headerName: '번호',
        field: 'answSeq',
        width: 60,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '포스트',
        field: 'answMemo',
        cellStyle: { minHeight: '46px', display: 'flex', alignItems: 'center', lineHeight: '21px', paddingTop: '3px', paddingBottom: '3px' },
        autoHeight: true,
        wrapText: true,
        flex: 1,
    },
    {
        headerName: '작성자',
        field: 'loginName',
        wrapText: true,
        width: 80,
        tooltipField: 'loginName',
        cellStyle: { display: 'flex', alignItems: 'center', lineHeight: '21px' },
    },
    {
        headerName: '공감수',
        field: 'goodCnt',
        width: 50,
        cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
        headerName: '상태',
        field: 'answDiv',
        width: 95,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRendererFramework: PostSelectRenderer,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        width: 88,
        wrapText: true,
        cellStyle: { whiteSpace: 'pre-wrap', display: 'flex', alignItems: 'center', lineHeight: '21px' },
    },
];
