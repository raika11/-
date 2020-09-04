import palette from './palette';

export default {
    fontFamily: ['"Noto Sans KR"', '"맑은고딕"', 'Roboto', 'Arial', 'sans-serif'].join(','),
    /**
     * 29px h1
     */
    h1: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '29px',
        lineHeight: 'normal'
    },
    /**
     * 24px h2
     */
    h2: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '24px',
        lineHeight: 'normal'
    },
    /**
     * 20px h3
     */
    h3: {
        color: palette.text.primary,
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: 'normal'
    },
    /**
     * 18px h4
     */
    h4: {
        color: palette.text.primary,
        fontSize: '18px',
        lineHeight: 'normal'
    },
    /**
     * 16px h5
     */
    h5: {
        color: palette.text.primary,
        fontSize: '16px',
        lineHeight: 'normal'
    },
    /**
     * 14px h6
     */
    h6: {
        color: palette.text.primary,
        fontSize: '14px',
        lineHeight: 'normal'
    },
    /**
     * 12px 기본 라벨
     */
    subtitle1: {
        color: palette.text.primary,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: 'normal'
    },
    /**
     * 14px subtitle
     */
    subtitle2: {
        color: palette.text.primary,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: 'normal'
    },
    /**
     * 12px 기본 바디
     */
    body1: {
        color: palette.text.primary,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: 'normal'
    },
    /**
     * 14px 바디
     */
    body2: {
        color: palette.text.primary,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: 'normal'
    },
    /**
     * 12px 버튼 폰트
     */
    button: {
        color: palette.text.primary,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: 'normal'
    },
    /**
     * 캡션 스타일 정의
     */
    caption: {
        color: palette.text.secondary,
        fontSize: '11px',
        letterSpacing: '0.33px',
        lineHeight: 'normal'
    },
    /**
     * 오버라인 스타일 정의
     */
    overline: {
        color: palette.text.secondary,
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 'normal',
        textTransform: 'uppercase'
    }
};
