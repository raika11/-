/**
 * WmsTreeView 스타일
 * @param {object} theme 테마
 */
const WmsTreeViewStyle = (theme) => ({
    treeview: {
        padding: 1,
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box'
    },
    loader: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        background: '#fff',
        opacity: 0.6
    },
    root: {
        color: theme.palette.tree.selected.bgColor,
        display: 'block',
        position: 'relative',
        '&:focus > $content, &$selected > $content': {
            backgroundColor: theme.palette.tree.selected.bgColor
        },
        '& $selected:hover > $content': {
            backgroundColor: theme.palette.tree.hover.bgColor
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent'
        }
    },
    '@keyframes dashAfter': {
        from: { width: 0 },
        to: { width: 14 }
    },
    dash: {
        '&$expanded:before': {
            content: '""',
            position: 'absolute',
            display: 'block',
            borderLeft: `1px dashed ${theme.palette.tree.dash}`,
            top: 24,
            left: 'var(--tree-item-dash, 14px)',
            bottom: 15
        },
        '&$expanded:after': {
            content: '""',
            position: 'absolute',
            display: 'block',
            borderBottom: `1px dashed ${theme.palette.tree.dash}`,
            animationName: '$dashAfter',
            animationDuration: '0.4s',
            width: 14,
            left: 'var(--tree-item-dash, 14px)',
            bottom: 15
        }
    },
    content: {
        color: theme.palette.tree.icon,
        paddingLeft: 3,
        width: 'auto',
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular
        },
        height: '32px',
        '&:hover': {
            backgroundColor: theme.palette.tree.hover.bgColor
        }
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: 'var(--tree-item-depth, 19px)'
        }
        // marginLeft: theme.spacing(1),
        // paddingLeft: theme.spacing(1),
        // borderLeft: '1px dashed rgba(0, 0, 0, 0.54)'
    },
    expanded: {},
    selected: {},
    label: {
        height: '100%',
        fontWeight: 'normal',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent !important;',
        '&:hover .extraBox': {
            visibility: 'visible',
            paddingRight: '8px',
            height: '100%'
        }
    },
    iconButton: {
        padding: 0,
        marginRight: 8,
        '& svg': {
            zIndex: 2,
            background: theme.palette.white
        }
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
        // padding: theme.spacing(0.5, 0)
    },
    labelText: {
        fontSize: 13,
        fontWeight: 'normal',
        flexGrow: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'var(--tree-item-useYn, inherit)'
    },
    labelTextHighlighted: {
        color: theme.palette.primary.main,
        fontWeight: '500'
    },
    labelIcon: {
        padding: theme.spacing(0.5),
        '& .MuiIcon-root': {
            fontSize: 21
        }
    },
    iconContainer: {
        all: 'unset'
    }
});

export default WmsTreeViewStyle;
