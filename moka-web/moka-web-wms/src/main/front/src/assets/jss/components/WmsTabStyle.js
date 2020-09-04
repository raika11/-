import commonStyle from '~/assets/jss/commonStyle';

/**
 * WmsTab 컴포넌트 스타일
 * @param {object} theme 테마
 */
const WmsTabStyle = (theme) => ({
    ...commonStyle,
    tabsDiv: {
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    swipeableViews: {
        height: 'calc(100% - 48px)',
        overflow: 'hidden'
    },
    tabRoot: ({ tabWidth }) => ({
        width: Number(tabWidth),
        minWidth: 0
    }),
    tabWrapper: {
        fontSize: 13,
        fontWeight: 'normal'
    },
    iconDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 4
    }
});
export default WmsTabStyle;
