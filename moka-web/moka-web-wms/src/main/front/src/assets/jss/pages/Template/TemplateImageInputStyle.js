import commonStyle from '~/assets/jss/commonStyle';

const TemplateImageInputStyle = () => ({
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    label: {
        width: 70,
        marginRight: '4px',
        fontSize: '12px',
        cursor: 'default',
        '& .MuiButtonBase-root': {
            width: 55,
            height: 25,
            padding: '4px 16px'
        }
    },
    drag: {
        height: 264,
        width: 'calc(100% - 74px)',
        borderRadius: 4,
        border: '1px dashed #9E9E9E'
    },
    dragInner: {
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F5F5',
        outline: 'none',
        '& svg': {
            color: '#9E9E9E'
        },
        '& .MuiTypography-root': {
            marginLeft: 8,
            fontSize: 12,
            color: 'rgba(0, 0, 0, 0.8)'
        }
    },
    preview: {
        position: 'absolute',
        display: 'flex',
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
        visibility: 'hidden'
    },
    previewOn: {
        visibility: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5'
    },
    alert: {
        position: 'absolute',
        top: 1,
        left: 1,
        right: 1
    },
    /**
     * 드래그 앤 드롭 컴포넌트
     */
    dragAndDropRoot: {
        display: 'inline-block',
        position: 'relative',
        '& > .landscape': {}
    },
    dragging: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.8)'
    },
    ...commonStyle
});

export default TemplateImageInputStyle;
