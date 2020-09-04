const pagingHeight = '42px';

/**
 * Table Style
 * @param theme 현재 테마
 */
const TableStyle = (theme) => ({
    /** 테이블컨테이너 + 페이징 */
    root: ({ otherHeight }) => ({
        width: '100%',
        height: otherHeight ? `calc(100% - ${otherHeight})` : '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
    }),
    /** 테이블로딩 영역 */
    loadingContainer: ({ paging, border }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        background: theme.palette.white,
        top: border.top ? 1 : 0,
        bottom: paging ? (border.bottom ? 44 : 43) : 1,
        left: border.left ? 1 : 0,
        right: border.right ? 1 : 0,
        zIndex: 2,
        opacity: 0.9
    }),
    /** 테이블 영역 */
    tableContainer: ({ paging, border }) => ({
        width: '100%',
        height: paging ? `calc(100% - ${pagingHeight})` : '100%',
        borderTop: border.top ? `1px solid ${theme.palette.table.box}` : undefined,
        borderBottom: border.bottom ? `1px solid ${theme.palette.table.box}` : undefined,
        borderLeft: border.left ? `1px solid ${theme.palette.table.box}` : undefined,
        borderRight: border.right ? `1px solid ${theme.palette.table.box}` : undefined,
        boxSizing: 'border-box',
        overflow: 'hidden',
        '& .MuiIconButton-root': {
            padding: 0
        },
        '& .MuiIcon-root, & .MuiSvgIcon-root': {
            fontSize: 17
        }
    }),
    /** 테이블(헤더+바디) */
    table: {
        display: 'table',
        height: '100%',
        tableLayout: 'fixed'
    },
    /** 테이블헤더 */
    thead: ({ rowHeight }) => ({
        width: '100%',
        paddingRight: 7,
        display: 'table',
        height: `${rowHeight}`,
        boxSizing: 'border-box'
    }),
    /** 테이블 헤더 셀 */
    theadCell: {
        padding: '0 4px',
        '&:last-child': {
            paddingRight: 7,
            boxSizing: 'content-box'
        },
        boxSizing: 'border-box',
        background: theme.palette.table.thead.background,
        color: theme.palette.table.thead.color,
        textAlign: 'center',
        fontWeight: '500'
    },
    rowSpan: {
        height: 24
    },
    /** 테이블바디 */
    tbody: ({ header, rowHeight }) => ({
        width: '100%',
        height: header ? `calc(100% - ${rowHeight})` : '100%',
        marginBottom: theme.spacing(2),
        overflowY: 'scroll',
        display: 'block',
        '& button': {
            color: '#9E9E9E'
        }
    }),
    /** 테이블바디의 tr */
    tr: ({ rowHeight }) => ({
        cursor: 'pointer',
        display: 'table',
        height: `${rowHeight}`,
        '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: theme.palette.table.tbody.selectedBackColor
        }
    }),
    /** useYN === 'Y'인 tr */
    useTr: {
        '& p, & svg': {
            color: theme.palette.table.tbody.color
        }
    },
    /** useYN === 'N'인 tr */
    notUseTr: {
        '& p, & svg': {
            color: theme.palette.table.tbody.notUseColor
        }
    },
    /** 테이블 검색결과 셀 */
    cell: {
        boxSizing: 'border-box',
        wordBreak: 'break-all',
        transform: 'rotate(-0.03deg)',
        padding: '0 4px !important',
        '& .MuiRadio-colorSecondary': {
            color: theme.palette.table.tbody.radioColor,
            '&.Mui-checked': {
                color: theme.palette.table.tbody.radioSelectedColor
            }
        },
        '& p': {
            fontSize: 12,
            display: 'block',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    },
    /** 컨텍스트 메뉴아이템 */
    contextMenuItem: {
        fontSize: '12px',
        minHeight: '32px'
    },
    /** 썸네일테이블 바디 */
    imageBody: {
        display: 'flex',
        flexFlow: 'wrap',
        alignContent: 'baseline',
        width: '100%',
        height: '100%',
        marginBottom: theme.spacing(2),
        overflowY: 'scroll',
        paddingBottom: 8,
        boxSizing: 'border-box'
    },
    /** 썸네일테이블 셀 */
    imageCell: {
        margin: 8,
        marginRight: 0,
        marginBottom: 0
    }
});

export default TableStyle;
