import commonStyle from '~/assets/jss';

/**
 * 로그인 컴포넌트 스타일
 * @param {object} 테마
 */
const WmsLoginStyle = (theme) => ({
    ...commonStyle,
    wrapper: {
        background: theme.palette.grey.main,
        display: 'flex',
        width: '100%',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        height: 300,
        width: 500,
        boxSizing: 'border-box',
        padding: 24
    },
    mb42: {
        marginBottom: 42
    }
});

export default WmsLoginStyle;
