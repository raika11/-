import RelationStyle from '~/assets/jss/pages/RelationStyle';

const DeskingRelationStyle = (theme) => {
    const RelationCommonStyle = RelationStyle(theme);
    return {
        ...RelationCommonStyle,
        relbar: {
            ...RelationCommonStyle.relbar,
            paddingTop: 39
        },
        detail: {
            width: '100%',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column'
        },
        infoRoot: {
            display: 'flex',
            justifyContent: 'space-between'
        }
    };
};
export default DeskingRelationStyle;
