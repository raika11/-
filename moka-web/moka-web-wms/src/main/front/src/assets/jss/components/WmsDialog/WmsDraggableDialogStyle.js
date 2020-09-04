import commonStyle from '~/assets/jss';

const WmsDraggableDialogStyle = (theme) => ({
    ...commonStyle,
    root: {
        '& .MuiDialogTitle-root': {
            '& .MuiButtonBase-root': { padding: '4px', float: 'right' }
        }
    },
    paperWidthSm: ({ width, height }) => ({
        width: width || 462,
        boxSizing: 'border-box',
        height
    }),
    paperWidthMd: ({ width, height }) => ({
        width: width || 585,
        boxSizing: 'border-box',
        height
    }),
    paperWidthLg: ({ width, height }) => ({
        width: width || 765,
        boxSizing: 'border-box',
        height
    }),
    paperWidthXl: ({ width, height }) => ({
        width: width || 1050,
        boxSizing: 'border-box',
        height
    }),
    content: {
        padding: 0,
        borderBottom: 0,
        display: 'block',
        position: 'relative',
        overflow: 'auto',
        width: '100%',
        height: '100%'
    },
    title: {
        cursor: 'move',
        '& .MuiTypography-h6': {
            fontSize: '12px',
            color: '#fff',
            lineHeight: '40px',
            paddingLeft: '8px'
        },
        width: '100%',
        height: '40px',
        backgroundColor: theme.palette.basic.dark,
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
        color: '#fff',
        top: '0'
    },
    /**
     * WmsResizeDialog
     */
    resizable: {
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        '& .react-resizable-handle': {
            position: 'absolute',
            width: 20,
            height: 20,
            bottom: 0,
            right: 0,
            background:
                // eslint-disable-next-line max-len
                "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
            'background-position': 'bottom right',
            padding: '0 3px 3px 0',
            'background-repeat': 'no-repeat',
            'background-origin': 'content-box',
            'box-sizing': 'border-box',
            cursor: 'se-resize'
        }
    },
    resizableBoxContent: {
        padding: 0,
        borderBottom: '0',
        height: 'calc(100% - 116px)',
        overflow: 'hidden',
        overflowY: 'auto'
    }
});

export default WmsDraggableDialogStyle;
