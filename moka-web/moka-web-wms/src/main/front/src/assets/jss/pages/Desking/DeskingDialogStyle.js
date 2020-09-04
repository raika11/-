import DialogStyle from '~/assets/jss/pages/DialogStyle';

/**
 * 화면편집 다이얼로그 스타일
 * @param {object} theme 테마
 */
export default (theme) => ({
    ...DialogStyle(theme),
    /**
     * Common Style
     */
    popupBody: {
        padding: '10px 12px 0',
        boxSizing: 'border-box',
        height: '100%'
    },
    flex: {
        display: 'flex'
    },
    w50: {
        width: '50%'
    },
    /**
     * 대표이미지 변경
     */
    imageEditBody: {
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        height: '100%',
        width: '100%'
    },
    imageEditLeftRow: {
        width: 217,
        padding: 24,
        boxSizing: 'border-box',
        backgroundColor: '#F4F5F6'
    },
    imgEditLeftList: {
        position: 'absolute',
        top: 240,
        width: 170,
        height: 346,
        background: '#fff'
    },
    imgEditLeftBtn: {
        display: 'flex',
        position: 'absolute',
        bottom: 21,
        left: 60,
        '& button': {
            marginRight: 8
        },
        '& button:last-child': {
            marginRight: 0
        }
    },
    imageEditRightRow: {
        width: 'calc(100% - 217px)',
        boxSizing: 'border-box'
    },
    imgEditTable: {
        height: 456
    },
    imgEditFooter: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            marginRight: 8
        },
        '& button:last-child': {
            marginRight: 0
        }
    },
    /** --------------------------
     * 예약설정(ReservationDialog)
     * -------------------------- */
    reservedPaper: {
        '& > .makeStyles-content-243': {
            padding: 0,
            width: 440,
            height: 100
        }
    },
    deskingName: {
        height: 27,
        padding: '2px 24px',
        background: '#F5F5F5'
    },
    dateSelect: {
        display: 'flex',
        padding: '16px 58px',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    dateBox: {
        width: 140,
        '& button': {
            padding: 0
        }
    },
    timeBox: {
        width: 100,
        '& button': {
            padding: 0
        }
    },
    textBox: {
        width: 23
    },
    /**
     * Componentedit Dialog
     */
    componentEditTable: {
        width: 228
    },
    arrowBtn: {
        width: 34,
        height: 34,
        boxSizing: 'border-box',
        border: '1px solid #9E9E9E',
        borderRadius: 'unset'
    },
    /**
     * Html Dialog
     */
    editor: {
        height: 'calc(100% - 44px)'
    },
    /** --------------------------
     * 템플릿편집(TemplateEditDialog)
     * -------------------------- */
    textLine: {
        display: 'flex',
        minHeight: 25
    },
    nameField1: {
        width: 75
    },
    dataField1: {
        display: 'flex',
        alignItems: 'center',
        width: 'calc(100% - 75px)'
    },
    nameField2: {
        width: 87
    },
    dataField2: {
        display: 'flex',
        alignItems: 'center',
        width: 'calc(100% - 87px)'
    },
    linkIcon: {
        width: 20,
        height: 20,
        padding: 4,
        '& span': {
            fontSize: 21
        },
        '&:hover ~ .underline': {
            textDecoration: 'underline'
        }
    },
    templateEditTable: {
        height: 527
    },
    /** --------------------------
     * 관련기사(RelationArticleDialog)
     * -------------------------- */
    relationDialogBody: {
        padding: '0 10px',
        boxSizing: 'border-box',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    relationLeftDiv: {
        width: 547,
        paddingBottom: 10,
        boxSizing: 'border-box'
    },
    relationRightDiv: {
        width: 467,
        paddingTop: 15,
        boxSizing: 'border-box',
        display: 'block',
        overflow: 'hidden'
    },
    footerBtn: {
        '& button': {
            marginRight: 8
        },
        '& button:last-child': {
            marginRight: 0
        },
        paddingTop: 10,
        float: 'right'
    },
    /** --------------------------
     * 히스토리(HistoryManagementDialog)
     * -------------------------- */
    historyBody: {
        padding: '8px 16px',
        boxSizing: 'border-box',
        height: '100%'
    },
    topInfo: {
        height: 20,
        fontSize: 13,
        letterSpacing: 0.16,
        padding: '6px 0 6px 5px'
    },
    historyLeftTable: {
        display: 'block',
        position: 'relative',
        float: 'left',
        height: '100%',
        width: 367,
        marginRight: 16,
        overflow: 'hidden'
    },
    historyRightTable: {
        display: 'block',
        position: 'relative',
        height: '100%',
        float: 'left',
        width: 443,
        overflow: 'hidden'
    },
    /**
     * Register Dialog
     */
    pb15: {
        paddingBottom: 15
    }
});
