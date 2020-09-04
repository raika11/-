/**
 * 자동완성 컴포넌트 스타일
 * @param {object} theme 현재 테마
 */
const WmsAutocompleteStyle = (theme) => ({
    label: ({ labelWidth }) => ({
        width: labelWidth ? `${String(labelWidth)}px` : undefined,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        marginRight: 4
    }),
    autogroup: ({ labelWidth }) => ({
        width: labelWidth ? `calc(100% - ${String(labelWidth)}px - 4px)` : '100%',
        position: 'relative'
    }),
    inputWrapper: {
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'relative',
        padding: '4px 35px 0 0',
        '&:hover $fieldset': {
            borderColor: '#212121'
        }
    },
    input: {
        flexGrow: 1,
        marginTop: -4,
        width: 0,
        minWidth: 30,
        '&.Mui-focused ~ $fieldset': {
            borderColor: '#2196F3',
            borderWidth: '2px'
        }
    },
    inputIcon: {
        position: 'absolute',
        top: 'calc(50% - 14px)',
        right: 0,
        marginRight: 8,
        marginTop: 3,
        marginBottom: 0,
        padding: 0
    },
    fieldset: ({ error }) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        border: `1px solid ${!error ? 'rgba(0, 0, 0, 0.23)' : '#f44336'}`,
        borderRadius: '4px',
        pointerEvents: 'none'
    }),
    loader: {
        position: 'absolute',
        top: '8px',
        bottom: '8px',
        width: 'calc(100% - 50px)',
        opacity: 0.5
    },
    tag: {
        height: 32,
        padding: '0px 0px 4px 4px',
        maxWidth: 'calc(100% - 40px)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center'
    },
    tagLabel: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        height: '100%',
        color: 'rgba(0, 0, 0, 0.87)',
        backgroundColor: '#EEEEEE',
        borderRadius: '16px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        '&:focus': {
            borderColor: '#40a9ff',
            backgroundColor: '#e6f7ff'
        },
        '& > span': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            paddingLeft: '4px',
            paddingRight: '12px',
            textOverflow: 'ellipsis',
            cursor: 'default'
        },
        '& > svg': {
            color: 'rgba(33, 33, 33, 0.26)',
            cursor: 'pointer',
            width: 18,
            height: 18,
            margin: '0 0 0 -6px',
            WebkitTapHighlightColor: 'transparent'
        }
    },
    listbox: {
        padding: '0',
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: '4px',
        listStyle: 'none',
        backgroundColor: '#fff',
        overflow: 'auto',
        maxHeight: '150px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1,
        fontSize: '12px',
        '& > li': {
            padding: '5px 12px',
            display: 'flex',
            '& > span': {
                flexGrow: '1'
            },
            '& > svg': {
                color: 'transparent'
            }
        },
        '& > li[aria-selected="true"]': {
            backgroundColor: '#fafafa',
            fontWeight: '600',
            '& > svg': {
                color: '#1890ff'
            }
        },
        '& > li[data-focus="true"]': {
            backgroundColor: '#e6f7ff',
            cursor: 'pointer',

            '& > svg': {
                color: '#000'
            }
        }
    },
    autoTextfield: ({ width }) => ({
        width: width ? `${String(width)}px` : '100%',
        display: 'inline-flex',
        flexDirection: 'row'
    }),
    requiredData: {
        width: '0',
        height: '6px',
        color: '#FF0707',
        lineHeight: '0'
    }
});

export default WmsAutocompleteStyle;
