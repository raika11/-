const TreeMenuStyle = (theme) => ({
    gnbTree: {
        listStyle: 'none',
        marginTop: 8,
        padding: '0'
    },
    gnbList: {
        width: 184,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        flexFlow: 'column'
    },
    gnbListContent: {
        color: 'rgba(255, 255, 255, 0.65)',
        flexDirection: 'row-reverse',
        height: 36
    },
    gnbListIconContainer: {
        marginRight: 10,
        color: 'inherit'
    },
    gnbListGroup: {
        marginLeft: 0
    },
    gnbIcon: {
        width: 24,
        height: 24,
        float: 'left',
        marginRight: 10,
        color: 'inherit'
    },
    displayName: {
        fontSize: 14,
        letterSpacing: 0.16,
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: '100%',
        margin: 0,
        textDecoration: 'none',
        color: 'inherit'
    },
    gnbLabel: {
        backgroundColor: 'transparent !important',
        color: 'inherit',
        marginLeft: 10,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
    },
    displayNameMini: {
        display: 'none'
    },
    displayNameToggle: {
        display: 'block'
    },
    current: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        color: 'rgba(255, 255, 255, 1) !important;',
        boxSizing: 'border-box'
    },
    selected: {},
    selected2: {},
    selected3: {},
    expanded1: {
        '&$gnbList': {
            backgroundColor: 'rgba(0, 0, 0, 0.35)'
        },
        '& > $gnbListContent': {
            color: '#fff'
        },
        '& > $gnbListGroup > div > div > $gnbList > $gnbListContent': {
            color: 'rgba(255, 255, 255, 0.65)'
        }
    },
    expanded2: {
        '&$gnbList': {},
        '& > $gnbListContent': {},
        '& > $gnbListContent$current': {
            color: '#fff !important;'
        },
        '& > $gnbListGroup > div > div > $gnbList > $gnbListContent': {
            color: 'rgba(255, 255, 255, 0.7)'
        }
    },
    expanded3: {}
});

export default TreeMenuStyle;
