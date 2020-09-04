import palette from './palette';

export default {
    fontFamily: ['"Noto Sans KR"', '"맑은고딕"', 'Roboto', 'Arial', 'sans-serif'].join(','),
    /**
     * H1 기본 스타일 정의
     */
    h1: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '29px',
        letterSpacing: '-0.24px',
        lineHeight: '38px'
    },
    /**
     * H2 기본 스타일 정의
     */
    h2: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '24px',
        letterSpacing: '-0.24px',
        lineHeight: '32px'
    },
    /**
     * H3 기본 스타일 정의
     */
    h3: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '20px',
        letterSpacing: '-0.06px',
        lineHeight: '28px'
    },
    /**
     * H4 기본 스타일 정의
     */
    h4: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '17px',
        letterSpacing: '-0.06px',
        lineHeight: '28px'
    },
    /**
     * H5 기본 스타일 정의
     */
    h5: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '15px',
        letterSpacing: '-0.05px',
        lineHeight: '25px'
    },
    /**
     * H6 기본 스타일 정의
     */
    h6: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '14px',
        letterSpacing: '-0.05px',
        lineHeight: '21px'
    },
    /**
     * 부제목1 스타일 정의
     */
    subtitle1: {
        color: palette.text.subtitle,
        fontSize: '14px',
        letterSpacing: '-0.05px',
        lineHeight: '21px'
    },
    /**
     * 부제목2 스타일 정의
     */
    subtitle2: {
        color: palette.text.subtitle,
        fontWeight: 400,
        fontSize: '13px',
        letterSpacing: '-0.05px',
        lineHeight: '21px'
    },
    /**
     * 본문1 스타일 정의
     */
    body1: {
        color: palette.text.primary,
        fontSize: '14px',
        letterSpacing: '-0.05px',
        lineHeight: '21px'
    },
    /**
     * 본문2 스타일 정의
     */
    body2: {
        color: palette.text.secondary,
        fontSize: '13px',
        letterSpacing: '-0.04px',
        lineHeight: '21px'
    },
    /**
     * 버튼 폰트 스타일 정의
     */
    button: {
        color: palette.text.primary,
        fontSize: '14px'
    },
    /**
     * 캡션 스타일 정의
     */
    caption: {
        color: palette.text.secondary,
        fontSize: '11px',
        letterSpacing: '0.33px',
        lineHeight: '13px'
    },
    /**
     * 오버라인 스타일 정의
     */
    overline: {
        color: palette.text.secondary,
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.33px',
        lineHeight: '16px',
        textTransform: 'uppercase'
    }
};
