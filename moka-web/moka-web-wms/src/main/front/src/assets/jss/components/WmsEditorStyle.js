import commonStyle from '~/assets/jss/commonStyle';

/**
 * WmsEditor 스타일
 */
const WmsEditorStyle = () => ({
    ...commonStyle,
    root: {
        display: 'block',
        overflow: 'hidden',
        position: 'relative'
    },
    overlayIcon: {
        position: 'absolute',
        top: 8,
        right: 22,
        zIndex: 2,
        '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
        }
    }
});

export default WmsEditorStyle;
