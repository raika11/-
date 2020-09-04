import WmsButtonColor from './WmsButtonColor';

const WmsButtonStyle = (theme) => ({
    button: {
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
        willChange: 'box-shadow, transform',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        touchAction: 'manipulation',
        cursor: 'pointer',
        '& a': {
            color: 'inherit',
            textDecoration: 'unset'
        },
        '&:hover, &:focus': {
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        }
    },
    transparent: {
        '&, &:focus, &:hover': {
            color: 'inherit',
            background: 'transparent',
            boxShadow: theme.shadows[0]
        }
    },
    disabled: {
        opacity: '0.65',
        pointerEvents: 'none',
        color: 'rgba(255, 255, 255, 0.4) !important;'
    },
    lg: {
        padding: '6px 12px',
        fontSize: '12px',
        lineHeight: '1.333333',
        borderRadius: '0.2rem'
    },
    long: {
        padding: '6px 20px',
        fontSize: '12px',
        lineHeight: '1.333333',
        borderRadius: '0.2rem'
    },
    sm: {
        padding: '0.40625rem 1.25rem',
        fontSize: '0.6875rem',
        lineHeight: '1.5',
        borderRadius: '0.2rem'
    },
    round: {
        borderRadius: '30px'
    },
    block: {
        width: '100% !important'
    },
    link: {
        '&, &:hover, &:focus': {
            backgroundColor: 'transparent',
            color: theme.palette.black,
            boxShadow: theme.shadows[0]
        }
    },
    ...WmsButtonColor(theme)
});

export default WmsButtonStyle;
