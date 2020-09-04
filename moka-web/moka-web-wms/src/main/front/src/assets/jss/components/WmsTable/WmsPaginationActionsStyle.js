/**
 * PaginationActions Style
 * @param theme 현재 테마
 */

const totalWidth = '88px';
const pagingHeight = '42px';

const PaginationActionsStyle = (theme) => ({
    root: {
        // flexShrink: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        '& > *': {
            margin: '10px'
        },
        height: `${pagingHeight}`
    },
    /**
     * 페이지 그룹이동 아이콘 <. >
     */
    arrrowButton: {
        padding: 0
    },
    /**
     * 숫자 페이징
     */
    numberButton: {
        minWidth: '20px',
        color: theme.palette.paging.number.color
    },
    numberSelectedButton: {
        color: theme.palette.paging.number.selectedColor
    },
    numbering: {
        width: `calc(100% - ${totalWidth})`,
        margin: '10px 0px',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center'
    },
    /**
     * 총 개수
     */
    total: {
        float: 'right',
        textAlign: 'right',
        width: `${totalWidth}`,
        height: `${pagingHeight}`,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    totalText: {
        color: theme.palette.paging.total.color,
        fontSize: '12px'
    }
});

export default PaginationActionsStyle;
