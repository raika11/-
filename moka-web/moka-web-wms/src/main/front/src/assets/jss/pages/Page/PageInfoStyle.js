import commonStyle from '~/assets/jss/commonStyle';

const PageInfoStyle = (theme) => ({
    root: {
        padding: '0 8px',
        boxSizing: 'border-box',
        position: 'relative'
    },
    buttonGroup: {
        display: 'flex',
        marginBottom: 8,
        justifyContent: 'space-between',
        '& div': {
            marginRight: 4
        },
        '& div:Last-Child': {
            marginRight: 0
        }
    },
    ...commonStyle
});

export default PageInfoStyle;
