import commonStyle from '~/assets/jss/commonStyle';

/**
 * 컴포넌트 인포 컨테이너 + form 폴더 하위
 * @param {object} theme 현재 테마
 */
const ComponentInfoStyle = (theme) => ({
    root: {
        padding: '8px 16px'
    },
    /**
     * info 영역
     */
    infoRoot: {
        height: 128
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoButtonGroup: {
        '& button': {
            fontWeight: 'normal',
            margin: 0,
            padding: '7px 12px'
        },
        '& button:nth-child(1)': {
            marginRight: 70
        },
        '& button:nth-child(2)': {
            marginRight: 8,
            width: 75
        },
        '& button:nth-child(3)': {
            width: 75
        },
        '& .MuiButton-label .material-icons': {
            marginLeft: 8,
            fontSize: '19px'
        }
    },
    seperator: {
        margin: '6px 0',
        backgroundColor: '#AAAAAA'
    },
    divider: {
        margin: '6px 0',
        backgroundColor: `${theme.palette.grey.main}`
    },
    dividerWrapper: {
        width: '100%',
        padding: '4px 0px'
    },
    /**
     * Set 영역
     */
    setRoot: {
        height: 'calc(100% - 145px)',
        margin: '0 -16px',
        padding: '0 16px',
        overflow: 'hidden',
        overflowY: 'auto'
    },
    label: {
        width: 70,
        marginRight: 4,
        cursor: 'default'
    },
    topFixedLabel: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10
    },
    disabledText: {
        color: '#9E9E9E',
        fontSize: 14
    },
    radioGroup: {
        marginRight: 10
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
    timeBox: {
        width: 80,
        '& .MuiInputAdornment-root': {
            width: 24,
            marginLeft: 4
        }
    },
    adLine: {
        alignItems: 'flex-start !important;'
    },
    adContents: {
        float: 'left'
    },
    /**
     * ExpansionPanel 스타일
     */
    expansionPanelRoot: {
        '&:before': {
            all: 'unset'
        },
        borderBottom: `1px solid ${theme.palette.grey.main}`,
        '&:last-child': {
            borderBottom: 0
        },
        paddingBottom: '8px !important;',
        margin: '8px 0px 0px 0px !important;',
        '& .MuiCollapse-hidden .MuiFormHelperText-root': {
            visibility: 'hidden'
        }
    },
    expansionPanelSummary: {
        height: '30px !important;',
        minHeight: '30px !important;',
        '& .MuiExpansionPanelSummary-content': {
            margin: '0px !important;'
        }
    },
    expansionPanelDetails: {
        padding: '16px 33px 8px 16px',
        flexWrap: 'wrap'
    },
    panelContents: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        paddingLeft: 94
    },
    contentsWithLabel: {
        display: 'flex',
        justifyContent: 'left',
        width: 'calc(100% - 78px)'
    },
    mr4: {
        marginRight: 4
    },
    mr16: {
        marginRight: 16
    },
    mr26: {
        marginRight: 26
    },
    mr34: {
        marginRight: 34
    },
    mr40: {
        marginRight: 40
    },
    ml74: {
        marginLeft: 74
    },
    ...commonStyle
});

export default ComponentInfoStyle;
