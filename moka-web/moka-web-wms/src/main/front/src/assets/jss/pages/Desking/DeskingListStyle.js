import commonStyle from '~/assets/jss/commonStyle';

const DeskingListStyle = (theme) => ({
    ...commonStyle,
    listRoot: {
        width: '100%',
        overflow: 'hidden'
    },
    topButton: {
        height: 45,
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 6,
        borderBottom: `1px solid ${theme.palette.black}`
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        background: theme.palette.white,
        top: 0,
        bottom: 1,
        left: 0,
        right: 0,
        zIndex: 2,
        opacity: 0.9
    },
    deskingComponent: {
        borderTop: `1px solid ${theme.palette.black}`,
        '&:nth-child(1)': {
            borderTop: 'none'
        },
        paddingBottom: 8
    },
    contents: {
        display: 'block',
        overflow: 'hidden',
        overflowY: 'scroll',
        height: 776
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    buttonGroupTop: {
        width: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        padding: '0px 2px',
        marginBottom: 5
    },
    iconButton: {
        boxSizing: 'border-box',
        width: 26,
        height: 26,
        padding: 3,
        marginRight: 5,
        '&:last-child': {
            marginRight: 0
        },
        '&:hover': {
            backgroundColor: 'unset',
            border: '1px dashed #C4C4C4',
            boxSizing: 'border-box',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    },
    reservedButton: {
        marginRight: 4
    },
    divider: {
        height: 16,
        background: '#C4C4C4',
        marginRight: 5
    },
    svg: {
        fontSize: 15,
        height: 16,
        width: 16
    },
    ag: {
        padding: '0 8px',
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
        overflow: 'hidden',
        /** ----------------
         * ag grid css
         * ----------------- */
        '& .ag-root-wrapper': {
            border: 'none'
        },
        '& .ag-header': {
            display: 'none'
        },
        '& .ag-row': {
            borderColor: '#fff',
            borderWidth: 1,
            backgroundColor: '#F4F7F9',
            borderRadius: 4,
            boxShadow: 'none',
            cursor: 'pointer'
        },
        '& .ag-row.ag-row-last': {
            borderBottomStyle: 'none'
        },
        '& .ag-row-dragging': {
            border: '1px dashed grey !important;'
        }
    },
    agSelected: {
        border: `1px solid ${theme.palette.basic.etc[2]} !important;`
    },
    dateBox: {
        width: '130px'
    },
    timeBox: {
        width: '130px'
    }
});
export default DeskingListStyle;
