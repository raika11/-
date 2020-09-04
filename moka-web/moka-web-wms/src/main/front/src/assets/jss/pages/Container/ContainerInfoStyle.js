import commonStyle from '~/assets/jss/commonStyle';

const ContainerInfoStyle = (theme) => ({
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
        justifyContent: 'flex-end',
        marginBottom: 8,
        '& .MuiButtonBase-root': {
            fontWeight: 'normal',
            margin: 0,
            padding: '7px 16px'
        },
        '& > button:nth-child(1)': {
            width: 80,
            marginRight: 8
        },
        '& > button:nth-child(2)': {
            width: 80
        }
    },
    ...commonStyle
});

export default ContainerInfoStyle;
