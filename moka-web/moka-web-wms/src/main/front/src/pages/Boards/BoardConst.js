// 등록시 사용할 select 옵션값.
export const selectItem = {
    orderType: [
        {
            value: '1',
            name: '일반',
        },
        {
            value: '9',
            name: '공지',
        },
    ],
    channelName: [
        {
            value: '1',
            name: '전체공지',
        },
        {
            value: '1',
            name: 'JPOD',
        },
    ],
    titlePrefix1: [
        {
            value: '1',
            name: '서비스 문의',
        },
        {
            value: '1',
            name: '데이터 문의',
        },
        {
            value: '1',
            name: '일반 문의',
        },
    ],
    titlePrefix2: [
        {
            value: '1',
            name: '서비스 문의',
        },
        {
            value: '1',
            name: '데이터 문의',
        },
        {
            value: '1',
            name: '일반 문의',
        },
    ],
    usedYn: [
        {
            value: 'Y',
            name: '사용',
        },
        {
            value: 'N',
            name: '삭제',
        },
    ],
    boardType: [
        {
            value: 'S',
            name: '서비스',
        },
        {
            value: 'A',
            name: '관리자',
        },
    ],
    insLevel: [
        {
            value: '0',
            name: '모두',
        },
        {
            value: '1',
            name: '회원',
        },
        {
            value: '9',
            name: '관리자',
        },
    ],
    viewLevel: [
        {
            value: '0',
            name: '모두',
        },
        {
            value: '1',
            name: '회원',
        },
        {
            value: '9',
            name: '관리자',
        },
    ],
    replyLevel: [
        {
            value: '0',
            name: '모두',
        },
        {
            value: '1',
            name: '회원',
        },
    ],
    answLevel: [
        {
            value: '0',
            name: '모두',
        },
        {
            value: '1',
            name: '회원',
        },
        {
            value: '9',
            name: '관리자',
        },
    ],
    channelType: [
        {
            value: 'BOARD_DIVC1',
            name: 'JPOD',
        },
        {
            value: 'BOARD_DIVC2',
            name: '기자',
        },
    ],
    recomFlag: [
        {
            value: '0',
            name: '사용안함',
        },
        {
            value: '1',
            name: '추천/비추천',
        },
        {
            value: '2',
            name: '추천만',
        },
    ],
};

export const tempRows = {
    szie: 20,
    total: 4,
    page: 1,
    list: [
        {
            boardSeq: 11774,
            channelName: '뉴요커가 읽어주는 3분 뉴스',
            title: '첫번째 글 입니다.',
            titlePrefix1: '서비스 문의',
            fileYn: 'Y',
            file: 'test.jpg',
            order: '일반',
            viewCount: 123,
            usedYn: 'Y',
            regDt: '2020-12-18 17:30:00',
            regId: 'ssc01',
        },
        {
            boardSeq: 11773,
            channelName: '뉴요커가 읽어주는 3분 뉴스',
            title: '삭제된 글은 이렇게 보입니다.',
            titlePrefix1: '서비스 문의',
            fileYn: 'Y',
            file: 'test.jpg',
            order: '공지',
            viewCount: 123,
            usedYn: 'N',
            regDt: '2020-12-18 17:30:00',
            regId: 'ssc01',
        },
        {
            boardSeq: 11772,
            channelName: '전체 공지',
            title: '세번째 글 입니다.',
            titlePrefix1: '서비스 문의',
            fileYn: 'Y',
            file: 'test.jpg',
            order: '일반',
            viewCount: 123,
            usedYn: 'Y',
            regDt: '2020-12-18 17:30:00',
            regId: 'ssc01',
        },
        {
            boardSeq: 11771,
            channelName: '오늘도 사러 갑니다',
            title: '네번째 글 입니다.',
            titlePrefix1: '제안하기',
            fileYn: 'Y',
            file: 'test.jpg',
            order: '일반',
            viewCount: 123,
            usedYn: 'N',
            regDt: '2020-12-18 17:30:00',
            regId: 'ssc01',
        },
        {
            boardSeq: 11770,
            channelName: '윤석민의 인간혁명',
            title: '네번째 글 입니다.',
            titlePrefix1: '서비스 문의',
            fileYn: 'Y',
            file: 'test.jpg',
            order: '일반',
            viewCount: 123,
            usedYn: 'Y',
            regDt: '2020-12-18 17:30:00',
            regId: 'ssc01',
        },
    ],
};
