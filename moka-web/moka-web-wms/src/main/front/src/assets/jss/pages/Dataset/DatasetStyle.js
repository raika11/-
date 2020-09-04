import commonStyle from '~/assets/jss/commonStyle';

/**
 * 데이터셋 스타일
 * @param {object} theme 현재 테마
 */
const DatasetStyle = (theme) => ({
    ...commonStyle,
    /**
     * 데이터셋 리스트
     */
    reverseIcon: {
        transform: 'rotate(180deg)'
    },
    listHide: {
        '& > .MuiCardContent-root': {
            visibility: 'hidden'
        },
        '& > .MuiCardHeader-root .MuiCardHeader-content': {
            display: 'none'
        }
    },
    /**
     * 데이터셋 리스트 > 검색
     */
    listSearchRoot: {
        height: 80,
        overflow: 'hidden'
    },
    /**
     * 데이터셋 리스트 > 테이블
     */
    listTableButtonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        height: 32
    },
    /**
     * 데이터셋 인포 컨테이너
     */
    infoRoot: {
        padding: '8px 16px'
    }
});

export default DatasetStyle;
