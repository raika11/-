import commonStyle from '~/assets/jss/commonStyle';

const EtccodeTableStyle = (theme) => ({
    button: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    leftTable: {
        height: '800px',
        width: '210px'
    },
    table: {
        height: '800px'
    },
    topBotton: {
        height: '50px'
    },
    leftNonTitle: {
        width: '230px',
        '& > .MuiPaper-root': {
            '& > .MuiCardHeader-root ': {
                display: 'none'
            }
        }
    },
    nonTitle: {
        '& > .MuiPaper-root': {
            '& > .MuiCardHeader-root ': {
                display: 'none'
            }
        }
    },
    ...commonStyle
});

export default EtccodeTableStyle;
