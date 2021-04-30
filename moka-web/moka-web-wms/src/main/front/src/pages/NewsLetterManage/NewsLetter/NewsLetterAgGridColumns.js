const cellClassRules = {
    'ag-pre-cell': () => true,
};

export default [
    {
        headerName: 'NO',
        field: 'letterSeq',
        width: 30,
    },
    {
        headerName: '방법',
        field: 'sendType',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 55,
    },
    {
        headerName: '유형',
        field: 'letterType',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 55,
    },
    {
        headerName: '카테고리',
        field: 'category',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 80,
    },
    {
        headerName: '뉴스레터 명',
        field: 'letterName',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        flex: 1,
    },
    {
        headerName: '발송 시작일',
        field: 'sendStartDt',
        width: 73,
    },
    {
        headerName: '최근 발송일',
        field: 'lastSendDt',
        width: 73,
    },
    {
        headerName: '발송 주기',
        field: 'sendPriod',
        children: [
            { headerName: '일정/콘텐츠', field: 'sendInfo', width: 72, cellClassRules },
            { headerName: '시간', field: 'sendTime', width: 35, cellClassRules },
        ],
    },
    {
        headerName: '구독자 수',
        field: 'subscribeCount',
        width: 60,
    },
    {
        headerName: '상태',
        field: 'status',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 60,
    },
    {
        headerName: '등록일',
        field: 'regDt',
        sortable: true,
        unSortIcon: true,
        sort: null,
        sortingOrder: ['asc', 'desc'],
        width: 73,
    },
    {
        headerName: '등록자',
        field: 'regInfo',
        // cellStyle: {},
        width: 50,
        // cellRendererFramework: ({ data }) => {
        //     return (
        //         <div className="w-100 h-100 d-flex flex-column justify-content-center">
        //             <p className="mb-0 text-truncate">{data.regMember.memberNm}</p>
        //             <p className="mb-0 text-truncate">({data.regMember.memberId})</p>
        //         </div>
        //     );
        // },
        tooltipField: 'regInfo',
    },
    {
        headerName: '전용 상품\n여부',
        field: 'scbYn',
        width: 60,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: 'A/B TEST',
        field: 'abtestYn',
        width: 65,
        cellRenderer: 'usedYnSecondRenderer',
    },
];
