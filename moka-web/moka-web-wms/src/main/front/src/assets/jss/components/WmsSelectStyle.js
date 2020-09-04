import commonStyle from '~/assets/jss/commonStyle';

/**
 * 셀렉트 컴포넌트 공통 스타일
 * @param {object} theme 테마
 */
const WmsSelectStyle = (theme) => ({
    ...commonStyle,
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
    select: {
        '&:focus': {
            outline: 'none'
        }
    },
    white: {
        color: '#fff',
        border: '1px solid #BC477B',
        '& > .MuiSelect-icon': {
            color: '#fff'
        }
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
    }
});

export default WmsSelectStyle;
