import commonStyle from '~/assets/jss/commonStyle';

const ReservedFormStyle = (theme) => ({
    serviceForm: {
        display: 'flex',
        justifyContent: 'space-between',
        '& > .btnForm button': {
            marginLeft: 8
        },
        '& > .btnForm button .MuiButton-label .material-icons': {
            marginLeft: 8,
            width: '18px',
            height: '18px',
            fontSize: '18px'
        }
    },
    lineForm: {
        height: '37px',
        display: 'flex',
        marginBottom: '11px',
        justifyContent: 'space-between'
    },
    ...commonStyle
});

export default ReservedFormStyle;
