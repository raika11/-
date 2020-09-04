import commonStyle from '~/assets/jss/commonStyle';

/**
 * 라디오 컴포넌트 공통 스타일
 * @param {object} theme 테마
 */
const WmsRadioStyle = (theme) => ({
    ...commonStyle,
    radio: {
        '& > span': {
            fontSize: '12px'
        }
    },
    root: {
        color: theme.palette.basic.main,
        '&$checked': {
            color: theme.palette.basic.main
        }
    },
    checked: {}
});

export default WmsRadioStyle;
