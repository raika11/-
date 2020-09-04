import commonStyle from '~/assets/jss/commonStyle';

/**
 * 템플릿 전체 스타일
 * @param {object} theme 현재 테마 데이터
 */

const EasytestStyle = (theme) => ({
    /**
     * 템플릿 리스트 컨테이너 > 검색
     */
    listSearchRoot: {
        height: 124,
        overflow: 'hidden'
    },
    /**
     * 템플릿 리스트 컨테이너 > 테이블
     */
    listTable: {
        height: 'calc(100% - 174px)'
    },
    listTableButtonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 32
    },
    ...commonStyle
});

export default EasytestStyle;
