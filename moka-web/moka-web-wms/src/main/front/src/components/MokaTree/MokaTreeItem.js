import React from 'react';
import MokaTreeLabel from './MokaTreeLabel';

const MokaTreeItem = (props) => {
    const { pageSeq, pageName, onNodeSelect, onInsert, onDelete } = props;

    /**
     * 노드 선택 시 실행
     */
    const haneldNodeSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onNodeSelect) {
            onNodeSelect(props);
        }
    };

    return (
        <li className="tree-item" onClick={haneldNodeSelect} key={pageSeq}>
            <div className="tree-label">
                <MokaTreeLabel pageaName={pageName} onInsert={onInsert} onDelete={onDelete} />
            </div>
        </li>
    );
};

export default MokaTreeItem;
