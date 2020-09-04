/**
 * TextField 컴포넌트 공통 스타일
 * @param {object} theme 테마
 */
const TextFieldStyle = (theme) => ({
    form: ({ width }) => {
        let obj = {
            width: '100%',
            display: 'inline-flex',
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 36
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
    label: ({ labelWidth }) => ({
        width: labelWidth ? Number(labelWidth) : 0,
        marginRight: '4px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'default'
    }),
    labelTop: {
        alignItems: 'flex-start',
        marginTop: '2px'
    },
    textField: ({ labelWidth, align }) => ({
        width: labelWidth ? `calc(100% - ${labelWidth}px - 4px)` : '100%',
        display: 'flex !important',
        justifyContent: align === 'right' ? 'flex-end' : undefined,
        fontSize: '12px',
        '&::placeholder': {
            fontSize: '12px'
        }
    }),
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    adornmentIcon: {
        padding: '0',
        '&:hover': {
            backgroundColor: 'initial'
        }
    },
    adormentIconDisabled: {
        backgroundColor: '#E8E8E8'
    },
    requiredData: {
        width: '0',
        height: '6px',
        color: '#FF0707',
        lineHeight: '0'
    },
    /** WmsTextFieldWidthDivider Style */
    rootPaper: {
        width: 'auto',
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'row'
    },
    textFieldPaper: ({ labelWidth, width }) => ({
        width: width ? Number(width) : `calc(100% - ${labelWidth || 0}px)`,
        borderRadius: 4,
        boxSizing: 'border-box',
        display: 'flex',
        height: 36
    }),
    inputWrapper: {
        position: 'relative',
        overflow: 'hidden'
    },
    input: {
        borderRadius: 4,
        '&.Mui-disabled': {
            backgroundColor: 'inherit'
        },
        '& button': {
            padding: 0
        }
    },
    linkBox: {
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'pointer',
        zIndex: 1,
        '&:hover ~ $input': {
            textDecoration: 'underline'
        }
    },
    divider: {
        backgroundColor: 'rgba(0, 0, 0, 0.23)',
        height: 26,
        marginTop: 4
    },
    disabled: {
        backgroundColor: '#E8E8E8'
    },
    error: {
        borderColor: '#f44336'
    }
});

export default TextFieldStyle;
