import WmsButtonColor from './WmsButtonColor';

const WmsIconButtonStyle = (theme) => ({
    textButton: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[1],
        minHeight: 'auto',
        minWidth: 'auto',
        height: '32px',
        border: 'none',
        borderRadius: '3px',
        position: 'relative',
        fontSize: '12px',
        fontWeight: '400',
        textTransform: 'uppercase',
        letterSpacing: '0',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        cursor: 'pointer',
        '&:hover, &:focus': {
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        },
        '& .fab, & .fas, & .far, & .fal, & .material-icons': {
            fontSize: '18px'
        },
        '& span': {
            textAlign: 'center'
        }
    },
    white: {
        color: '#fff'
    },
    square: {
        borderRadius: '0',
        width: '30px',
        height: '30px',
        background: '#F5F5F5',
        border: '1px solid #9E9E9E',
        boxSizing: 'border-box',
        '& > span': { position: 'absolute' }
    },
    noticePoint: {
        fontSize: '0',
        width: '6px',
        position: 'absolute',
        height: '6px',
        right: '7px',
        top: '7px',
        borderRadius: '4px',
        backgroundColor: '#FF0707'
    },
    bar: {
        width: '36px',
        height: '36px',
        borderRadius: '4px',
        fontSize: '14px',
        margin: '0 6px',
        color: '#9E9EA5 !important'
    },
    round: {
        borderRadius: '30px'
    },
    disabled: {
        opacity: '0.65',
        pointerEvents: 'none',
        color: 'rgba(255, 255, 255, 0.4) !important;'
    },
    ...WmsButtonColor(theme)
});

export default WmsIconButtonStyle;
