import React from 'react';
import AgGrid from './MenuSmallAgGrid';

const MenuSmallLIst = (props) => {
    const { handleRowClicked, depth, menuId, parentMenuId } = props;
    return (
        <>
            <AgGrid depth={depth} menuId={menuId} parentMenuId={parentMenuId} handleRowClicked={handleRowClicked} />
        </>
    );
};

export default MenuSmallLIst;
