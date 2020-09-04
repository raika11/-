import commonStyle from '~/assets/jss/commonStyle';

const DeskingTreeStyle = (theme) => ({
    searchTreeRoot: {
        height: '810px',
        boxSizing: 'border-box',
        border: '1px solid #9E9E9E'
    },
    searchDomainSelect: {
        width: '244px',
        height: '32px',
        // left: '8px',
        // top: '8px',

        // border: '0.5px solid #757575',
        boxSizing: 'border-box',
        borderRadius: '4px'
    },
    noTitle: {
        '& > .MuiPaper-root': {
            '& > .MuiCardHeader-root ': {
                display: 'none'
            }
        }
    },
    ...commonStyle
});
export default DeskingTreeStyle;
