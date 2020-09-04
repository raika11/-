import commonStyle from '~/assets/jss';

const VolumeStyle = (theme) => ({
    ...commonStyle,
    /**
     * 볼륨 관리
     */
    volumeButton: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    listTable: {
        height: 'calc(100% - 40px)'
    },
    /**
     * 볼륨 정보
     */
    formRoot: {
        padding: '0 8px',
        height: '100%',
        overflow: 'hidden'
    },
    formButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button .MuiButton-label .material-icons': {
            marginLeft: 8,
            width: '18px',
            height: '18px',
            fontSize: '18px'
        },
        '& button:last-child': {
            marginLeft: 8
        }
    },
    mb12: {
        marginBottom: 12
    }
});

export default VolumeStyle;
