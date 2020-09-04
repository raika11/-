/**
 * Pagination Style
 * @param theme 현재 테마
 */

const pagingHeight = '42px';

const PaginationStyle = (theme) => ({
    /** 스크롤 제거 */
    root: ({ popup }) => ({
        overflow: 'hidden',
        marginTop: popup && '-1px',
        borderTop: popup && `1px solid ${theme.palette.table.box}`,
        borderBottom: popup && `1px solid ${theme.palette.table.box}`
    }),
    /** 페이징툴바 */
    toolbar: {
        justifyContent: 'space-between',
        paddingLeft: 0,
        minHeight: `${pagingHeight}`
    },
    /** 페이지그룹 셀렉트박스 caption 제거 */
    caption: { display: 'none' },
    /** 페이지그룹 셀렉트박스 폰트 색상 */
    input: { color: theme.palette.paging.rowPerPages.color },
    /** 페이지그룹 셀렉트박스 */
    selectRoot: {
        margin: 0
    },
    // select: { float: 'left' },
    spacer: { display: 'none' }
});

export default PaginationStyle;
