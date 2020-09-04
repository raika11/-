/**
 * 스위치 컴포넌트 공통 스타일
 * @param {object} theme 테마
 */
const WmsSwitchStyle = (theme) => ({
    root: ({ width }) => {
        let obj = {
            flexDirection: 'row'
        };
        if (width) {
            let w = width;
            if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
                w += 'px';
            }
            obj.width = w;
        }

        return obj;
    },
    label: ({ labelWidth }) => {
        let obj = {
            marginRight: '4px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            '&::placeholder': {
                fontSize: '12px'
            },
            cursor: 'default'
        };
        if (labelWidth) {
            let w = labelWidth;
            if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
                w += 'px';
            }
            obj.width = w;
        }
        return obj;
    },
    selectField: ({ labelWidth }) => {
        let obj = {
            width: '100%'
        };
        if (labelWidth) {
            obj.width = `calc(100% - ${labelWidth}px - 4px)`;
        }

        return obj;
    },
    requiredData: {
        width: '0',
        height: '6px',
        color: '#FF0707',
        lineHeight: '0'
    }
});

export default WmsSwitchStyle;
