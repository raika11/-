/**
 * 전체 공통 스타일
 */
const commonStyle = {
    mt8: {
        marginTop: 8
    },
    mr8: {
        marginRight: 8
    },
    mb8: {
        marginBottom: 8
    },
    ml8: {
        marginLeft: 8
    },
    mr0: {
        marginRight: 0
    },
    mb0: {
        marginBottom: 0
    },
    m0: {
        margin: 0
    },
    m8: {
        margin: 8
    },
    p8: {
        padding: 8
    },
    p0: {
        padding: '0px !important;'
    },
    pt8: {
        paddingTop: 8
    },
    pr8: {
        paddingRight: 8
    },
    pb8: {
        paddingBottom: 8
    },
    pl8: {
        paddingLeft: 8
    },
    w100: {
        width: '100%'
    },
    h100: {
        height: '100%',
        boxSizing: 'border-box'
    },
    inLine: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        outline: 'none'
    },
    spaceBetween: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    transparent: {
        opacity: 0,
        background: 'transparent'
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    portrait: {
        width: 'auto',
        height: '100%'
    },
    landscape: {
        width: '100%',
        height: 'auto'
    },
    show: {
        display: 'block'
    },
    hide: {
        display: 'none !important;'
    },
    hidden: {
        visibility: 'hidden'
    },
    block: {
        display: 'block',
        overflow: 'hidden'
    },
    relative: {
        position: 'relative'
    },
    loadingBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        zIndex: 2,
        opacity: 0.6,
        display: 'flex'
    }
};

export default commonStyle;
