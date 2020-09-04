import commonStyle from '~/assets/jss/commonStyle';

const ActionMenuStyle = () => ({
    ...commonStyle,
    paper: {
        border: '1px solid #757575'
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0
    },
    item: {
        fontSize: '12px',
        minHeight: '32px'
    }
});

export default ActionMenuStyle;
