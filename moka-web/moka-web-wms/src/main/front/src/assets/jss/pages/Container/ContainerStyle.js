import commonStyle from '~/assets/jss/commonStyle';

const ContainerStyle = (theme) => ({
    ...commonStyle,
    /**
     * 컨테이너 리스트 컨테이너
     */
    reverseIcon: {
        transform: 'rotate(180deg)'
    },
    listHide: {
        '& > .MuiCardContent-root': {
            visibility: 'hidden'
        },
        '& > .MuiCardHeader-root .MuiCardHeader-content': {
            display: 'none'
        }
    },
    /**
     * 컨테이너 리스트 > 검색
     */
    listSearchRoot: {
        height: 80
    },
    listTableButtonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        height: 32
    }
});

export default ContainerStyle;
