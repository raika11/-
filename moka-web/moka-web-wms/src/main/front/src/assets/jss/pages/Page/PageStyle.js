import commonStyle from '~/assets/jss/commonStyle';

/**
 * 페이지 스타일
 * @param {object} theme 현재 테마
 */
const PageStyle = (theme) => ({
    ...commonStyle,
    /**
     * 페이지 리스트 컨테이너
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
     * 페이지 리스트 > 검색
     */
    listSearchRoot: {
        height: 80,
        overflow: 'hidden'
    },
    /**
     * 페이지 리스트 > 트리
     */
    listTreeRoot: {
        height: 'calc(100% - 90px)',
        border: `1px solid ${theme.palette.table.box}`
    }
});

export default PageStyle;
