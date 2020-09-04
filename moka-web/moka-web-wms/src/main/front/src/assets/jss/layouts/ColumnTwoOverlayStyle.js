/**
 * Layout > ColumnTwoOverlayStyle
 * @param {*} theme
 */
const ColumnTwoOverlayStyle = (theme) => ({
    wrapper: {
        position: 'relative',
        minWidth: '1280px'
    },
    main: {
        overflow: 'auto',
        position: 'relative',
        float: 'right',
        maxHeight: '100%',
        width: '100%',
        overflowScrolling: 'touch'
    },
    container: {
        float: 'right',
        width: 'calc(100% - 190px)',
        maxHeight: '100%',
        marginLeft: 190,
        marginTop: 58,
        display: 'grid',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.standard
        }),
        overflowScrolling: 'touch',
        height: '500px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            width: '7px',
            backgroundColor: '##000'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#5C5C6A',
            borderRadius: '4px'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#DDDDDD'
        }
    },
    containerOn: {
        width: 'calc(100% - 56px)',
        marginLeft: 56,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.standard
        })
    },
    map: {
        marginTop: '70px'
    },
    hideBoard: {
        display: 'none !important'
    },
    sidebarMini: {
        width: 'calc(100% - 59px)',
        transition: 'width 0.5s',
        marginLeft: '57px'
    }
});

export default ColumnTwoOverlayStyle;
