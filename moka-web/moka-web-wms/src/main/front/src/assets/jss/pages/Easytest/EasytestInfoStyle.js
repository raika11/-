import commonStyle from '~/assets/jss/commonStyle';

const EasytestInfoStyle = (theme) => ({
    root: {
        position: 'relative',
        height: '100%'
    },
    container: {
        display: 'block',
        height: '819px',
        overflow: 'hidden',
        overflowY: 'auto',
        margin: '0 -8px',
        padding: '0 16px'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
        '& .MuiButtonBase-root': {
            fontWeight: 'normal',
            margin: 0,
            padding: '7px 12px'
        },
        '& > .left button:nth-child(1)': {
            width: 94,
            marginRight: 8
        },
        '& > .left button:nth-child(2)': {
            width: 56
        },
        '& > .right button:nth-child(1)': {
            width: 80,
            marginRight: 8
        },
        '& > .right button:nth-child(2)': {
            width: 80
        },
        '& > .right button .MuiButton-label .material-icons': {
            marginLeft: 8,
            fontSize: '19px'
        }
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
    dialog: {
        width: 456
    },
    ...commonStyle
});

export default EasytestInfoStyle;
