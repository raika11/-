import React from 'react';
import { MokaIcon } from '@components';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TreeItem = (props) => {
    const { boardId } = props;
    const history = useHistory();
    const { pagePathName } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
    }));

    const { nodeId, nodeData, onSelected, selectItem } = props;
    const { depth, usedYn, match } = nodeData;

    /**
     * 노드 선택 시 실행
     */
    const handleSelected = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onSelected) {
            onSelected(nodeData, e);
        }

        history.push(`/${pagePathName}/${boardId}`);
    };

    return (
        <li className="tree-item" onClick={(e) => handleSelected(e)} key={nodeId} data-depth={depth} data-usedyn={usedYn}>
            <div className={clsx('tree-label', { selected: selectItem })} data-match={match}>
                <Button variant="searching" size="sm" className="mr-1" disabled>
                    <MokaIcon iconName="fal-minus" />
                </Button>
                <span>{nodeData.boardName}</span>
            </div>
        </li>
    );
};

export default TreeItem;
