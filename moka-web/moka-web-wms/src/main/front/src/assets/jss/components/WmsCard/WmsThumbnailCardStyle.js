import commonStyle from '~/assets/jss/commonStyle';

/**
 * 썸네일카드 스타일
 * @param {object} theme 테마
 */
const WmsThumbnailCardStyle = (theme) => ({
    hidden: {
        visibility: 'hidden'
    },
    root: ({ width, height }) => {
        let obj = {
            border: '1px solid #757575',
            boxSizing: 'border-box',
            position: 'relative',
            transition: 'none'
        };

        let w = width;
        if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
            w += 'px';
        }
        obj.width = w;

        let h = height;
        if (typeof h === 'string' && h.indexOf('%') < 0 && h.indexOf('px') < 0) {
            h += 'px';
        }
        obj.height = h;

        return obj;
    },
    menuPaper: {
        border: '1px solid #757575'
    },
    content: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        boxSizing: 'border-box',
        height: 'calc(100% - 48px)',
        padding: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: `${theme.palette.grey.main}`,
        borderBottom: '1px solid #757575',
        '& img': {
            overflow: 'hidden'
        },
        textAlign: 'center',
        cursor: 'pointer'
    },
    onlyThumbnail: {
        height: '100%',
        paddingBottom: '0 !important;',
        borderBottom: 'none'
    },
    svg: {
        color: '#8f8d8d',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            fontSize: '32px !important;',
            color: '#c0c0c0'
        }
    },
    actions: {
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: 48,
        padding: 5,
        fontSize: '12px',
        '& > .MuiTypography-root': {
            width: '100%',
            marginLeft: '5px',
            marginRight: '5px'
        }
    },
    actionsTop: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button': {
            marginRight: 3
        },
        '& button:last-child': {
            marginRight: 0
        }
    },
    rotateIcon: {
        transform: 'rotate(90deg)'
    },
    actionsIcon: {},
    landscape: commonStyle.landscape,
    portrait: commonStyle.portrait,
    selected: {
        boxShadow: `0 0 0 1px ${theme.palette.basic.etc[4]} !important`,
        borderColor: `${theme.palette.basic.etc[4]} !important`
    },
    titleText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.8)',
        cursor: 'default'
    },
    bodyText: {
        fontSize: 11,
        color: 'rgba(0,0,0,0.4)',
        cursor: 'default'
    },
    overlayBox: {
        width: 51,
        height: 22,
        background: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 5,
        position: 'absolute',
        right: 2,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    overlayText: {
        color: '#fff'
    },
    footerRoot: ({ useYn }) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: useYn ? '' : '#9E9E9E',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    })
});

export default WmsThumbnailCardStyle;
