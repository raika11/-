/**
 * WmsDialogAlert 스타일
 */
export default () => ({
    paperWidthXs: {
        width: 440
    },
    title: {
        boxSizing: 'border-box',
        padding: '16px 24px',
        cursor: 'default',
        display: 'flex',
        justifyContent: 'space-between',
        '& > .MuiTypography-root': {
            fontWeight: 500
        },
        '& > button': {
            padding: 0
        },
        '& > button:hover': {
            backgroundColor: 'unset'
        }
    },
    actions: {
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItmes: 'center',
        '& button': {
            minWidth: 59,
            marginRight: 8
        },
        '& button:last-child': {
            marginRight: 0
        }
    },
    content: {
        '& > p': {
            fontSize: 13,
            color: 'rgba(0, 0, 0, 0.54)',
            letterSpacing: 0.15
        }
    }
});
