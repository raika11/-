import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Button from 'react-bootstrap/Button';
import DeskingTreeLabel from './DeskingTreeLabel';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * 트리아이템 식별키
     */
    nodeId: PropTypes.string.isRequired,
    /**
     * 선택된 노드아이디
     */
    selected: PropTypes.string,
    /**
     * 노드 클릭 콜백
     */
    onSelected: PropTypes.func,
};
const defaultProps = {};

/**
 * 데스킹 트리 아이템 컴포넌트
 */
const DeskingTreeItem = (props) => {
    const { nodeId, selected, nodeData, onSelected } = props;

    /**
     * 노드 선택 시 실행
     */
    const handleSelected = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onSelected) {
            onSelected(nodeData, e);
        }
    };

    return (
        <li className="tree-item" onClick={handleSelected} key={nodeId}>
            <div className={clsx('tree-label', { selected: selected === nodeId })}>
                <Button
                    size="sm"
                    variant={selected === nodeId ? 'info' : 'white'}
                    className={clsx('d-flex align-items-center justify-content-center mr-1 flex-shrink-0', { border: selected !== nodeId })}
                    disabled
                >
                    <MokaIcon iconName="fal-minus" />
                </Button>
                <DeskingTreeLabel nodeId={nodeId} nodeData={nodeData} />
            </div>
        </li>
    );
};

DeskingTreeItem.propTypes = propTypes;
DeskingTreeItem.defaultProps = defaultProps;

export default DeskingTreeItem;
