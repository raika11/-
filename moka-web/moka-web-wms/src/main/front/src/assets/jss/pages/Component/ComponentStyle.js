import commonStyle from '~/assets/jss/commonStyle';

/**
 * 컴포넌트 스타일
 * @param {object} theme 현재 테마
 */
const ComponentStyle = (theme) => ({
    /**
     * 컴포넌트 리스트
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
     * 컴포넌트 리스트 > 검색
     */
    listSearchRoot: {
        height: 124,
        overflow: 'hidden'
    },
    /**
     * 컴포넌트 리스트 > 테이블
     */
    listTable: {
        height: 'calc(100% - 174px)'
    },
    listTableButtonGroup: {
        display: 'flex',
        flexDirection: 'row-reverse',
        height: 32,
        '& button': {
            margin: 0
        }
    },
    ...commonStyle
});

export default ComponentStyle;
