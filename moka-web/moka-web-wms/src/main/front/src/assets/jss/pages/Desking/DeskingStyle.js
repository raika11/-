import commonStyle from '~/assets/jss';

// 데스킹기사
const isDesked = '#EBF8FF';
// 고침기사
const isEdited = '#FFF2F2';
// ag grid 공통 스타일
const agGridCommon = {
    '& .ag-row.ag-row-last': {
        borderBottomStyle: 'solid'
    },
    '& .ag-row-dragging': {
        border: '1px dashed grey !important;'
    }
};

/**
 * 화면편집 전체 스타일
 * @param {object} theme 테마
 */
export default (theme) => ({
    ...commonStyle,
    isDesked,
    isEdited,
    '@global': {
        '.ag-dnd-ghost': {
            zIndex: '1301 !important;'
        }
    },
    /** ----------------
     * 편집화면/예약화면/My화면
     * ----------------- */
    tabCard: {
        padding: '0 !important;'
    },
    tabCardRoot: {
        width: '100%',
        height: '100%'
    },
    /** ----------------
     * 관련기사리스트
     * ----------------- */
    relArticleListAgGrid: {
        height: 528,
        position: 'relative',
        ...agGridCommon,
        '&.ag-theme-wms-grid .ag-cell': {
            lineHeight: '33px'
        },
        '&.ag-theme-wms-grid .ag-react-container': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }
    },
    relArticleAddButton: {
        width: 46,
        height: 20,
        borderRadius: 0
    },
    relArticleListView: {
        position: 'absolute',
        width: 479,
        height: 710,
        top: -138,
        right: -487,
        display: 'none',
        border: `1px solid ${theme.palette.border.main}`,
        boxSizing: 'border-box',
        zIndex: 1,
        backgroundColor: theme.palette.white,
        overflow: 'hidden',
        overflowY: 'auto'
    },
    relArticleListViewShow: {
        display: 'block'
    },
    relArticleEditAgGrid: {
        height: 52,
        border: '1px solid #C4C4C4',
        borderRadius: 4,
        padding: '8px 4px',
        boxSizing: 'border-box',
        '& .ag-layout-normal': {
            border: 'none'
        },
        '& .ag-header': {
            border: 'none',
            minHeight: '0 !important;',
            height: '0 !important;'
        },
        '& .ag-row': {
            backgroundColor: '#F4F7F9',
            border: '1px solid #E0E0E0',
            borderRadius: 4
        },
        ...agGridCommon
    },
    relArticleEditRelAgGrid: {
        height: 'auto',
        minHeight: 46
    },
    /** ----------------
     * 기사리스트
     * ----------------- */
    articleListRoot: {
        display: 'block',
        position: 'relative'
    },
    articleListSearchButton: {
        width: 55
    },
    articleListTop: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing(1)
    },
    articleListInfo: {
        ...commonStyle.spaceBetween,
        alignItems: 'flex-end'
    },
    circle1: {
        width: 12,
        height: 12,
        backgroundColor: isDesked,
        border: '1px solid #DADADA',
        boxSizing: 'border-box',
        borderRadius: '50%'
    },
    circle2: {
        width: 12,
        height: 12,
        backgroundColor: isEdited,
        border: '1px solid #DADADA',
        boxSizing: 'border-box',
        borderRadius: '50%'
    },
    dateBox: {
        width: 120,
        '& .MuiInputAdornment-root': {
            width: 24
        },
        '& .MuiFormHelperText-root': {
            position: 'absolute',
            width: '223px',
            top: '-22px',
            marginLeft: 0
        },
        '& button': {
            padding: 0
        }
    },
    articleListAgGrid: {
        height: 727,
        position: 'relative'
    },
    '@keyframes viewOn': {
        from: { right: -520 },
        to: { right: -10 }
    },
    '@keyframes viewOff': {
        from: { right: -10 },
        to: { right: -520 }
    },
    articleListView: {
        position: 'absolute',
        right: -520,
        top: 0,
        width: 500,
        height: 728,
        backgroundColor: theme.palette.white,
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        overflowY: 'auto'
    },
    articleListViewClose: {
        position: 'absolute',
        top: 13,
        right: 10,
        borderRadius: 4,
        width: 20,
        height: 20,
        zIndex: 2,
        cursor: 'pointer',
        outline: 'none',
        '& span': {
            fontSize: 20
        }
    },
    articleListViewShow: {
        animationName: '$viewOn',
        animationDuration: '0.5s',
        right: -10
    },
    articleListViewHide: {
        animationName: '$viewOff',
        animationDuration: '0.5s',
        right: -520
    },
    articleTitleWrapper: {
        marginTop: 30,
        padding: '8px 8px 0px 8px'
    },
    articleTitle: {
        borderBottom: '1px solid black',
        paddingBottom: 10
    },
    articleBody: {
        display: 'block',
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: '0px 14px 14px 14px',
        fontWeight: 'normal',
        lineHeight: '20px',
        letterSpacing: '0.16px',
        marginTop: 8,
        '& p': {
            padding: 0,
            margin: 0
        },
        '& img': {
            maxWidth: '100%'
        }
    },
    /** ----------------
     * 데스킹 편집폼
     * ----------------- */
    infoRoot: {
        display: 'flex',
        flexDirection: 'row',
        height: 410,
        padding: '0 8px',
        borderBottom: '1px solid #EEEEEE',
        marginBottom: 18
    },
    /** ----------------
     * 데스킹 편집폼 > 왼쪽
     * ----------------- */
    infoLeftRoot: {
        width: 530,
        marginRight: 16
    },
    infoName: {
        alignItems: 'baseline',
        height: 36,
        '& div:nth-child(1) p:first-child': {
            width: 25,
            marginRight: 5
        },
        '& div:nth-child(1) p:nth-child(2)': {
            width: 480
        },
        '& div:nth-child(2) p:first-child': {
            width: 160,
            marginRight: 5,
            fontSize: 10,
            color: 'rgba(0, 0, 0, 0.65)'
        },
        '& div:nth-child(2) p:nth-child(2)': {
            width: 380,
            fontSize: 10,
            color: 'rgba(0, 0, 0, 0.65)'
        }
    },
    /** ----------------
     * 데스킹 편집폼 > 오른쪽
     * ----------------- */
    infoRightRoot: {
        width: 'calc(100% - 546px)'
    },
    infoTopButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 17
    },
    infoRightContent: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    infoDetail: {
        marginRight: 16,
        width: 320
    },
    infoRightRelation: {
        width: '100%',
        height: 139,
        borderRadius: 4,
        border: `1px solid ${theme.palette.border.main}`,
        boxSizing: 'border-box',
        padding: 5,
        overflowY: 'scroll'
    },
    infoRightRelTag: {
        background: '#F4F7F9',
        marginBottom: 5,
        borderRadius: 4,
        boxSizing: 'border-box',
        padding: 5,
        height: 30,
        cursor: 'default',
        '& > p': {
            width: 230,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        },
        '& > button': {
            padding: 0,
            marginLeft: 4,
            color: '#DADADA'
        }
    },
    infoRightImageEdit: {
        width: 150,
        position: 'relative',
        top: 25
    },
    infoRightImageInsert: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
        boxSizing: 'border-box',
        background: '#C4C4C4',
        border: `1px solid ${theme.palette.border.main}`
    },
    infoRightImageAddBtn: {
        position: 'absolute',
        outline: 'none',
        top: 62,
        left: 62,
        zIndex: 2,
        cursor: 'pointer',
        '& span': {
            color: theme.palette.wolf.main
        }
    },
    infoRightImageDelBtn: {
        position: 'absolute',
        outline: 'none',
        right: 9,
        top: 11,
        borderRadius: 4,
        width: 18,
        height: 18,
        zIndex: 2,
        cursor: 'pointer',
        backgroundColor: theme.palette.wolf.main,
        '& span': {
            width: 18,
            height: 18,
            fontSize: 18,
            color: theme.palette.white
        }
    },
    disabled: {
        background: '#E8E8E8'
    },
    /** ----------------
     * 데스킹 편집폼 > 미리보기
     * ----------------- */
    previewTopButtom: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    preview: {
        height: 384
    },
    /** ----------------
     * 데스킹 히스토리
     * ----------------- */
    histPageName: {
        height: 36,
        marginBottom: 15
    },
    hist1: {
        width: 520,
        marginRight: 8,
        height: 802
    },
    hist2: {
        width: 471,
        height: 802,
        position: 'relative'
    },
    topInfo: {
        position: 'absolute',
        top: -31,
        height: 20,
        fontSize: 13,
        letterSpacing: 0.16,
        padding: '6px 0 6px 5px'
    },
    /** ----------------
     * 편집화면 공통
     * ----------------- */
    isDeskedBackground: {
        background: `${isDesked} !important;`
    },
    numText: {
        width: 30
    },
    endText: {
        display: 'flex',
        alignItems: 'flex-end'
    },
    readText: {
        lineHeight: '17px',
        letterSpacing: '0.16px',
        color: '#5C5C5C',
        '& > p': {
            marginBottom: '10px'
        }
    },
    topFixedLabel: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    mr2: {
        marginRight: 2
    },
    mb15: {
        marginBottom: 15
    },
    mr20: {
        marginRight: 20
    }
});
