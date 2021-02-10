export const ColumnDefs = [
    {
        headerName: '번호',
        field: 'boardId',
        width: 50,
    },
    {
        headerName: '게시판명',
        field: 'boardName',
        width: 180,
        tooltipField: 'boardName',
    },
    {
        headerName: '게시판 설명',
        field: 'boardDesc',
        width: 210,
        flex: 1,
        tooltipField: 'boardDesc',
    },
    {
        headerName: '게시판 유형',
        field: 'boardTypeName',
        width: 95,
    },
    {
        headerName: '사용',
        field: 'usedYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '답변',
        field: 'answYn',
        width: 40,
        cellRenderer: 'usedYnRenderer',
    },
    {
        headerName: '생성일',
        field: 'regDt',
        width: 130,
    },
];

export const tempRows = {
    szie: 20,
    list: [
        {
            boardSeq: 100,
            boardName: '첫번째 게시판',
            boardExplan: '첫번째 게시판 설명',
            boardCategory: '서비스',
            usedYn: 'Y',
            answerYn: 'Y',
            regDt: '2020-12-18 17:30:00',
        },
        {
            boardSeq: 99,
            boardName: '게시판 이름 1',
            boardExplan: '게시판 설명 1',
            boardCategory: '관리자',
            usedYn: 'N',
            answerYn: 'Y',
            regDt: '2020-12-18 17:30:00',
        },
        {
            boardSeq: 98,
            boardName: '게시판 이름 1',
            boardExplan: '게시판 설명 1',
            boardCategory: '서비스',
            usedYn: 'Y',
            answerYn: 'N',
            regDt: '2020-12-18 17:30:00',
        },
        {
            boardSeq: 97,
            boardName: '게시판 이름 1',
            boardExplan: '게시판 설명 1',
            boardCategory: '비관리자',
            usedYn: 'N',
            answerYn: 'N',
            regDt: '2020-12-18 17:30:00',
        },
    ],
};
