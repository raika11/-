import commonStyle from '~/assets/jss/commonStyle';

const ReservedTableStyle = (theme) => ({
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        height: 32
    },
    table: {
        height: '100%'
    },
    ...commonStyle
});

export default ReservedTableStyle;
