import React from 'react';
import Tree from './DeskingTree';
import List from './deskingWork/DeskingWorkList';

/**
 * 화면편집 Tree 컴포넌트
 */
const DeskingList = () => {
    return (
        <>
            <Tree />
            <List />
        </>
    );
};

export default DeskingList;
