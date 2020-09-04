import commonStyle from '~/assets/jss/commonStyle';

/**
 * 다이얼로그 공통 스타일
 * @param {object} theme 현재 테마
 */
const DialogStyle = (theme) => ({
    ...commonStyle,
    root: {},
    popupHeader: {
        width: '100%',
        height: '40px',
        backgroundColor: theme.palette.basic.dark,
        display: 'flex',
        justifyContent: 'space-between'
    },
    headerContent: {
        color: theme.palette.basic.contrastText,
        padding: '12px 12px',
        fontSize: '12px'
    },
    popupBody: {},
    table: {
        height: 425
    },
    editor: {
        height: 'calc(100% - 20px)'
    },
    popupFooter: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& button': {
            marginRight: 8
        },
        '& button:last-child': {
            marginRight: 0
        }
    },
    p16: {
        paddingLeft: 16,
        paddingTop: 16,
        paddingRight: 16
    },
    mr16: {
        marginRight: 16
    },
    borderNone: {
        border: 'none'
    }
});

export default DialogStyle;
