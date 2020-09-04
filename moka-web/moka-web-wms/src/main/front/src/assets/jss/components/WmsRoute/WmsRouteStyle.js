/**
 * Layout > RouterStyle
 */
const WmsRouteStyle = (theme) => ({
    wrapper: {
        position: 'relative',
        minWidth: '1280px',
        maxWidth: 1920
    },
    topbar: {
        backgroundColor: theme.palette.topbar.main,
        width: '100%',
        minWidth: theme.breakpoints.values.sm,
        height: '50px',
        position: 'fixed',
        zIndex: 4
    },
    sidebar: {
        position: 'fixed',
        overflow: 'hidden',
        zIndex: 5
    },
    container: {
        display: 'flex',
        alignItems: 'start',
        float: 'right',
        width: 'calc(100% - 200px)',
        maxHeight: '100%',
        marginLeft: 184,
        marginTop: 50,
        padding: 8,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.standard
        }),
        backgroundColor: '#F5F5F5',
        overflowScrolling: 'touch',
        overflowY: 'auto'
    },
    containerOn: {
        width: 'calc(100% - 64px)',
        marginLeft: 64
    },
    map: {
        marginTop: 70
    },
    hide: {
        display: 'none !important'
    },
    sidebarMini: {
        width: 'calc(100% - 59px)',
        transition: 'width 0.5s',
        marginLeft: 57
    }
});

export default WmsRouteStyle;
