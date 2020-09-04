import WmsButtonColor from './WmsButtonColor';

const WmsToggleButtonStyle = (theme) => ({
    root: {
        padding: 4,
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[0],
        minHeight: 'auto',
        minWidth: 'auto',
        height: '32px',
        border: 'none',
        position: 'relative',
        fontSize: '12px',
        fontWeight: '400',
        letterSpacing: '0',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.06)',
            color: theme.palette.primary.contrastText
        },
        '& .MuiTouchRipple-child': {
            borderRadius: '0 !important'
        }
    },
    square: {
        color: `${theme.palette.grey.main}`,
        borderRadius: '0',
        background: '#F5F5F5',
        border: `1px solid ${theme.palette.grey.main}`,
        '&:not(:last-child)': {
            borderRight: 0
        },
        '&.Mui-selected': {
            color: '#5C5C6A',
            border: '1px solid #9E9E9E',
            background: '#F5F5F5'
        },
        '&:hover': {
            color: `${theme.palette.grey.main}`
        },
        '&.Mui-selected:hover': {
            color: '#5C5C6A'
        }
    },
    selected: {
        backgroundColor: 'unset',
        color: 'unset',
        '&:hover': {
            backgroundColor: 'unset',
            color: 'unset'
        }
    },
    disabled: {
        opacity: '0.65',
        pointerEvents: 'none'
    },
    ...WmsButtonColor(theme)
});

export default WmsToggleButtonStyle;
