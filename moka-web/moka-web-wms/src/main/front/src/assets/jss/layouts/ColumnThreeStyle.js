/**
 * Layout > ColumnThreeStyle
 */
const ColumnThreeStyle = (theme) => ({
    wrapper: {
        position: 'relative',
        width: '1920px'
    },
    child: {
        overflow: 'hidden',
        overflowY: 'auto',
        overflowWrap: 'break-word',
        display: 'flex',
        height: 871
    },
    containerChild1: ({ widthOne }) => {
        let obj = {
            marginRight: 8
        };
        if (widthOne) {
            let w = widthOne;
            if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
                w += 'px';
            }
            obj.width = w;
        }
        return obj;
    },
    containerChild2: ({ widthTwo }) => {
        let obj = {
            marginRight: 8
        };
        if (widthTwo) {
            let w = widthTwo;
            if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
                w += 'px';
            }
            obj.width = w;
        }
        return obj;
    },
    containerChild3: ({ widthThree }) => {
        let obj = {
            justifyContent: 'flex-end',
            marginLeft: 'auto'
        };
        if (widthThree) {
            let w = widthThree;
            if (typeof w === 'string' && w.indexOf('%') < 0 && w.indexOf('px') < 0) {
                w += 'px';
            }
            obj.width = w;
        }
        return obj;
    }
});

export default ColumnThreeStyle;
