import WmsButtonColor from './WmsButtonColor';

const WmsOutlinedButtonStyle = (theme) => ({
    root: {
        height: 32,
        minWidth: 59
    },
    label: {
        fontWeight: 500
    },
    ...WmsButtonColor(theme)
});

export default WmsOutlinedButtonStyle;
