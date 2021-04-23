import React from 'react';
import MenuEditContainerEdit from './MenuEditContainerEdit';

const MenuEditContainer = (props) => {
    const { handleClickDelete, menuSeq, depth, parentMenuId } = props;
    return <MenuEditContainerEdit handleClickDelete={handleClickDelete} menuSeq={menuSeq} depth={depth} parentMenuId={parentMenuId} />;
};

export default MenuEditContainer;
