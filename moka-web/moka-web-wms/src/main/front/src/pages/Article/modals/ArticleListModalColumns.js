export default [
    {
        headerName: '매체',
        width: 100,
        field: 'sourceName',
        tooltipField: 'sourceName',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: '기사유형',
        width: 75,
        field: 'artTypeName',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: '사진',
        width: 60,
        field: 'artThumb',
        cellRenderer: 'imageRenderer',
    },
    {
        headerName: '',
        width: 36,
        // 편집 그룹 + 동영상(OVP/YOUTUBE/둘다)
        cellRenderer: 'GroupNumberRenderer',
        cellStyle: { width: '36px' },
    },
    {
        headerName: '제 목',
        field: 'escapeTitle',
        width: 186,
        flex: 1,
        autoHeight: true,
        tooltipField: 'escapeTitle',
        cellStyle: {
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            lineHeight: '20px',
            fontSize: '14px',
            height: '50px',
            display: '-webkit-box',
            paddingTop: '5px',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            cursor: 'pointer',
        },
    },
    {
        headerName: '면/판',
        width: 50,
        field: 'myunPan',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
    {
        headerName: '출고시간\n수정시간',
        width: 85,
        field: 'articleDt',
        cellClassRules: {
            'pre-wrap-cell': () => true,
        },
        cellStyle: {
            height: '50px',
            lineHeight: '20px',
        },
    },
    {
        headerName: '기자명',
        width: 95,
        field: 'reportersText',
        tooltipField: 'artReporter',
        cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
        },
    },
];