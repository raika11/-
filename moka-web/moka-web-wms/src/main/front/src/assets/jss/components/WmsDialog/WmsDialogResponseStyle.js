import commonStyle from '~/assets/jss/commonStyle';

const WmsDraggableDialogStyle = (theme) => ({
    root: {
        '& .MuiDialogTitle-root': {
            '& .MuiButtonBase-root': { padding: '4px', float: 'right' }
        }
    },
    paperWidthSm: {
        maxWidth: 462
    },
    paperWidthMd: {
        maxWidth: 585
    },
    paperWidthLg: {
        maxWidth: 765
    },
    content: {
        padding: 0,
        borderBottom: '0'
    },
    title: {
        cursor: 'move',
        '& .MuiTypography-h6': {
            fontSize: '20px',
            color: 'rgba(0, 0, 0, 0.87)',
            paddingLeft: '8px',
            fontFamily: 'Roboto',
            fontWeight: '500',
            lineHeight: '160%',
            letterSpacing: '0.15px'
        },
        margin: '18px 24px',
        width: '90%',
        height: '40px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    actions: {
        justifyContent: 'center',
        height: '60px'
    },
    closeBtn: {
        position: 'fixed',
        right: '0',
        borderRadius: '0',
        height: '40px',
        float: 'right',
        fontSize: '18px',
        color: '#fff'
    },
    ...commonStyle
});
export default WmsDraggableDialogStyle;
