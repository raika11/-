const SidebarStyle = (theme) => ({
    navi: {
        position: 'fixed',
        width: '184px',
        height: 'calc(100% - 50px)',
        minHeight: 894,
        marginTop: '50px',
        backgroundColor: theme.palette.topbar.main,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.short
        }),
        overflow: 'hidden',
        zIndex: 5,
        boxShadow: '5px 0 5px -5px #cccccc'
    },
    naviOn: {
        width: '48px'
    },
    toggleOn: {
        width: '184px',
        zIndex: '1200'
    },
    menuArea: {
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.basic.etc[2]
    },
    logoForm: {
        width: '184px',
        height: '50px',
        backgroundColor: theme.palette.basic.etc[2]
    },
    logoImg: {
        width: '160px',
        height: '26.18px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '12px 12px 11.82px 12px'
    },
    miniLogoForm: {
        width: '48px',
        height: '50px',
        backgroundColor: theme.palette.basic.etc[2],
        transition: 'width 0.5s'
    },
    miniLogoImg: {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    },
    toggleLogoForm: {
        width: '184px',
        height: '50px',
        backgroundColor: theme.palette.basic.etc[2]
    },
    toggleLogoImg: {
        width: '160px',
        height: '26.18px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '12px 12px 11.82px 12px'
    }
});

export default SidebarStyle;
