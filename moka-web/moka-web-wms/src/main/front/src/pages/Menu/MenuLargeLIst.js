import React from 'react';
import AgGrid from './MenuLargeAgGrid';

const MenuLargeLIst = (props) => {
    const { handleRowClicked, depth, menuId, parentMenuId } = props;
    return (
        <>
            <AgGrid depth={depth} menuId={menuId} parentMenuId={parentMenuId} handleRowClicked={handleRowClicked} />
        </>
    );
};

export default MenuLargeLIst;
