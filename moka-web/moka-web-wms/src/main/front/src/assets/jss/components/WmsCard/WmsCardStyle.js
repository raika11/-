const WmsCardStyle = (theme) => ({
    MuiCard: ({ width }) => {
        let obj = {
            width: '100%',
            border: `1px solid ${theme.palette.grey.main}`,
            boxSizing: 'border-box',
            position: 'relative'
        };
        if (width) {
            let w = width;
            if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
                w += 'px';
            }
            obj.width = w;
        }
        return obj;
    },
    loader: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        zIndex: 2,
        opacity: 0.6
    },
    MuiCardHeaderRoot: {
        height: '32px',
        background: 'rgba(92, 92, 92, 0.1)',
        padding: '0',
        '& .MuiCardHeader-title': {
            fontFamily: 'Noto Sans KR',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            height: '17.55px',
            marginLeft: '10px',
            lineHeight: '17px',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '0.16px',
            color: '#000000'
        },
        '& .MuiCardHeader-content': {
            cursor: 'default',
            overflow: 'hidden'
        },
        '& > .MuiCardHeader-action': {
            margin: 0
        },
        '& > .MuiCardHeader-action > .MuiButtonBase-root': {
            padding: 4,
            margin: 0,
            borderRadius: 0,
            color: theme.palette.basic.etc[2],
            backgroundColor: 'transparent'
        },
        '& > .MuiCardHeader-action > .MuiButtonBase-root:last-child': {
            marginRight: 4
        },
        '& > .MuiCardHeader-action > .MuiToggleButton-root.Mui-selected': {
            backgroundColor: 'rgba(78,13,58,0.12)'
        },
        '& .MuiTouchRipple-child': {
            borderRadius: '0 !important'
        }
    },
    MuiCardContentRoot: ({ header }) => ({
        boxSizing: 'border-box',
        position: 'relative',
        padding: 8,
        height: `calc(100% ${header ? '- 32px' : ''})`,
        '&:last-child': {
            paddingBottom: '8px'
        }
    })
});

export default WmsCardStyle;
