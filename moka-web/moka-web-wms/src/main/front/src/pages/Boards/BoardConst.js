// 등록시 사용할 select 옵션값.
export const selectItem = {
    usedYn: [
        { name: '전체', value: '' },
        { name: '노출', value: 'Y' },
        { name: '삭제', value: 'N' },
    ],
    insLevel: [
        { name: '전체', value: '0' },
        { name: '회원', value: '1' },
        { name: '관리자', value: '2' },
    ],
    viewLevel: [
        { name: '전체', value: '0' },
        { name: '회원', value: '1' },
        { name: '관리자', value: '2' },
    ],
    answLevel: [
        { name: '전체', value: '0' },
        { name: '회원', value: '1' },
        { name: '관리자', value: '2' },
    ],
    recomFlag: [
        { name: '미사용', value: '0' },
        { name: '추천/비추천', value: '1' },
        { name: '추천만', value: '2' },
    ],
    channelType: [
        { value: 'BOARD_DIVC1', name: 'JPOD' },
        { value: 'BOARD_DIVC2', name: '기자' },
    ],
    FileExt: ['all', 'zip', 'xls', 'xlsx', 'ppt', 'doc', 'hwp', 'jpg', 'png', 'gif'],
};
