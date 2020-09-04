import commonStyle from '~/assets/jss/commonStyle';
/**
 * WmsRoute > Topbar Style
 * @param {object} theme 현재 테마
 */
const TopbarStyle = (theme) => ({
    ...commonStyle,
    head: {
        backgroundColor: theme.palette.basic.etc[2],
        color: theme.palette.basic.contrastText,
        width: '100%',
        minWidth: theme.breakpoints.values.sm,
        height: '50px',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoSphere: {
        width: '184px',
        height: '50px',
        left: '0',
        top: '0',
        float: 'left'
    },
    logo: {
        position: 'absolute',
        width: '144px',
        height: '24px',
        padding: '13px 0 0 24px',
        fontFamily: 'Noto Sans KR',
        fontStyle: 'normal',
        fontWeight: '800',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '0.16px',
        textAlign: 'center',
        lineHeight: '100%'
    },
    topbarContent: {
        display: 'flex',
        width: 'calc(100% - 184px)',
        height: '50px',
        justifyContent: 'space-between'
    },
    leftContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& > button:first-child': {
            marginRight: 8
        }
    },
    rightContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 6
    },
    notice: {
        width: '340px',
        marginRight: '50px'
    },
    profile: {
        display: 'flex',
        alignItems: 'center'
    },
    profileImg: {
        borderRadius: '32px',
        width: '32px',
        height: '32px',
        backgroundColor: '#EDEDED',
        color: '#AD93A5',
        '& > svg': {
            position: 'relative',
            width: '20px',
            height: '20px',
            top: '6px',
            left: '6px'
        },
        marginLeft: '10px'
    },
    profileName: {
        width: '40px',
        height: '18px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '13px',
        color: '#fff',
        marginLeft: '9px'
    },
    logout: {
        marginLeft: 28
    }
});

export default TopbarStyle;
