import commonStyle from '~/assets/jss';

const DomainStyle = (theme) => ({
    ...commonStyle,
    /**
     * 도메인 리스트 컨테이너
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
     * 도메인 리스트 컨테이너 > 테이블
     */
    listTable: {
        height: 'calc(100% - 40px)'
    },
    listTableButtonGroup: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    /**
     * 도메인 인포 컨테이너 > 폼
     */
    formRoot: {
        padding: '0 8px',
        height: '100%',
        overflow: 'hidden'
    },
    spaceBetween: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    formStyle: {
        width: 652,
        display: 'flex',
        alignItems: 'center'
    },
    formButton: {
        '& button': {
            marginLeft: 8
        },
        '& button .MuiButton-label .material-icons': {
            marginLeft: 8,
            width: '18px',
            height: '18px',
            fontSize: '18px'
        }
    },
    radioForm: {
        display: 'flex',
        alignItems: 'center',
        marginRight: 30,
        height: 36,
        position: 'relative',
        overflow: 'hidden'
    },
    volumeForm: {
        '& button': {
            marginLeft: 0
        }
    },
    required: {
        width: '0',
        height: '6px',
        color: '#FF0707',
        lineHeight: '0'
    },
    label: {
        width: 55,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center'
    },
    mr37: {
        marginRight: 37
    },
    mb12: {
        marginBottom: 12
    }
});

export default DomainStyle;
