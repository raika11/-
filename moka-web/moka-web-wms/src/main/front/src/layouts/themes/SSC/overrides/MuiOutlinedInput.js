export default {
    root: {
        boxSizing: 'border-box',
        borderRadius: '4px',
        color: '#757575',
        '&$disabled$error $notchedOutline': {
            borderColor: '#f44336'
        }
    },
    input: {
        padding: 8
    },
    adornedEnd: {
        paddingRight: 10
    },
    multiline: {
        padding: 0,
        '& .MuiInputAdornment-positionEnd': {
            paddingRight: 8
        }
    },
    inputMultiline: {
        padding: 8
    }
};
