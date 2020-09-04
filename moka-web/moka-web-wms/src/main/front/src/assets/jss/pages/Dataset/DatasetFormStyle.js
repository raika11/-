import commonStyle from '~/assets/jss/commonStyle';

const DatasetFormStyle = (theme) => ({
    root: {
        position: 'relative',
        height: '100%'
    },
    container: {
        display: 'block',
        height: '827px',
        overflow: 'hidden',
        overflowY: 'auto',
        margin: '0 -8px 0 -8px',
        padding: '0 8px 0 8px'
    },
    id: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 32,
        '& button:first-child': {
            margin: '0 8px 0 0'
        },
        '& button:last-child': {
            margin: 0
        }
    },
    size: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& > .img-size': {
            display: 'flex',
            alignItems: 'center'
        },
        '& > .img-size > .MuiTypography-root': {
            margin: '0 4px'
        }
    },
    footer: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    footerButton: {
        textAlign: 'center',
        '& .MuiButtonBase-root': {
            width: 83,
            marginRight: 8
        },
        '& .MuiButtonBase-root:last-child': {
            marginRight: 0
        },
        '& .MuiButtonBase-root .MuiButton-label .material-icons': {
            marginLeft: 10
        }
    },
    headLine: {
        width: '100%',
        height: '1px',
        backgroundColor: '#AAAAAA'
    },
    btnForm: {
        width: '350px',
        display: 'flex',
        justifyContent: 'space-between',
        '& > .secondBtnForm button .MuiButton-label .material-icons': {
            marginLeft: 8,
            width: '18px',
            height: '18px',
            fontSize: '18px'
        }
    },
    datasearchForm: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: '40px'
    },
    soloLabel: {
        color: '#212121',
        fontSize: '12px',
        fontFamily: 'Noto Sans KR',
        fontWeight: '400',
        letterSpacing: '-0.05px',
        width: '70px',
        height: '36px',
        marginRight: '4px'
    },
    titleLabel: {
        color: '#212121',
        fontSize: '14px',
        fontFamily: 'Noto Sans KR',
        fontWeight: '400',
        letterSpacing: '-0.05px',
        width: '70px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        marginRight: '4px'
    },
    dataSettingForm: {
        width: '700px',
        margin: '0 0 0 65px'
    },
    ...commonStyle
});

export default DatasetFormStyle;
