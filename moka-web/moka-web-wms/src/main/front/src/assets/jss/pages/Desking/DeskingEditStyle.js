import commonStyle from '~/assets/jss/commonStyle';

const DeskingEditStyle = (theme) => ({
    noTitle: {
        width: '100%',
        '& > .MuiPaper-root': {
            height: '100%',
            '& > .MuiCardHeader-root ': {
                display: 'none'
            }
        }
    },
    tabStyle: {
        height: '44px'
    },
    tabRoot: {
        width: '100%',
        height: '100%'
    },
    tabWidth: {
        padding: 0
    },
    tabBody: {},
    ...commonStyle
});
export default DeskingEditStyle;
