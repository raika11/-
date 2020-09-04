/**
 * 버튼 색상표
 * @param {object} theme 현재 테마
 */
const WmsButtonColor = (theme) => ({
    default: {
        backgroundColor: theme.palette.default.main,
        color: theme.palette.default.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.default.main
        },
        '&:hover': {
            backgroundColor: theme.palette.default.dark
        }
    },
    basic: {
        backgroundColor: theme.palette.basic.main,
        color: theme.palette.primary.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.basic.main
        },
        '&:hover': {
            backgroundColor: theme.palette.basic.dark
        }
    },
    wolf: {
        backgroundColor: theme.palette.wolf.main,
        color: theme.palette.wolf.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.wolf.main
        },
        '&:hover': {
            backgroundColor: theme.palette.wolf.dark
        }
    },
    del: {
        backgroundColor: theme.palette.del.main,
        color: theme.palette.del.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.del.main
        },
        '&:hover': {
            backgroundColor: theme.palette.del.dark
        }
    },
    primary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.primary.main
        },
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    info: {
        background: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        '&:focus': {
            background: theme.palette.info.main
        },
        '&:hover': {
            backgroundColor: theme.palette.info.dark
        }
    },
    success: {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.success.main
        },
        '&:hover': {
            backgroundColor: theme.palette.success.dark
        }
    },
    warning: {
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.warning.main
        },
        '&:hover': {
            backgroundColor: theme.palette.warning.dark
        }
    },
    error: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.error.main
        },
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    },
    grey: {
        backgroundColor: theme.palette.grey.main,
        color: theme.palette.grey.contrastText,
        '&:focus': {
            backgroundColor: theme.palette.grey.main,
            color: theme.palette.grey.contrastText
        },
        '&:hover': {
            backgroundColor: theme.palette.grey.dark,
            color: theme.palette.grey.contrastText
        }
    }
});

export default WmsButtonColor;
