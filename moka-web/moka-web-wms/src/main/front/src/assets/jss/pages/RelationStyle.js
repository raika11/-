import commonStyle from '~/assets/jss/commonStyle';

export const searchTypeWidth = 130;
export const searchTypeLabelWidth = 30;
export const keywordWidth = 'calc(100% - 138px)';

/**
 * 릴레이션 컨테이너, 릴레이션 바 공통 스타일
 * @param {object} theme 현재 테마
 */
const RelationStyle = (theme) => ({
    relbarLeft: {
        borderRight: 0
    },
    relbar: {
        padding: 6
    },
    button: {
        textAlign: 'right',
        '& .MuiButtonBase-root': {
            margin: 0
        }
    },
    childTable: {
        height: 'calc(100% - 84px)'
    },
    table: {
        height: 'calc(100% - 44px)'
    },
    pageTable: {
        height: 'calc(100% - 86px)'
    },
    histTable: {
        height: 'calc(100% - 44px)'
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 32
    },
    templateTable: {
        height: 'calc(100% - 174px)'
    },
    pagePageTable: {
        height: 'calc(100% - 44px)'
    },
    /**
     * 릴레이션바
     */
    relbarRoot: {
        height: '822px',
        background: '#FFFFFF',
        '& .MuiIconButton-root': {
            border: 'none',
            margin: '0 0 16px 0'
        }
    },
    site: {
        '& .MuiIconButton-label': {
            transform: 'rotate(90deg) scaleX(-1)'
        }
    },
    active: {
        background: theme.palette.wolf.main,
        color: '#FFF !important',
        '&:hover, &:focus': {
            background: theme.palette.wolf.dark
        }
    },
    ...commonStyle
});

export default RelationStyle;
