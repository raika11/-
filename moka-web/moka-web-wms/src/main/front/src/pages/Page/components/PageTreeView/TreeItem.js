import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import TreeLabel from './TreeLabel';
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
    /**
     * 현재 노드 데이터
     */
    nodeData: PropTypes.shape({
        depth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        usedYn: PropTypes.oneOf(['Y', 'N']),
        match: PropTypes.oneOf(['Y', 'N']),
    }).isRequired,
    /**
     * 트리라벨에 마우스 hover할 때 나오는 버튼 리스트
     */
    labelHoverButtons: PropTypes.array,
};
const defaultProps = {};

const MokaTreeItem = (props) => {
    const { nodeId, selected, nodeData, onSelected, labelHoverButtons } = props;
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
    };

    return (
        <li className="tree-item" onClick={handleSelected} key={nodeId} data-depth={depth} data-usedyn={usedYn}>
            <div className={clsx('tree-label', { selected: selected === nodeId })} data-match={match}>
                <Button
                    size="sm"
                    variant={selected === nodeId ? 'info' : 'white'}
                    className={clsx('d-flex align-items-center justify-content-center mr-2', { border: selected !== nodeId })}
                    disabled
                >
                    <MokaIcon iconName="fal-minus" />
                </Button>
                <TreeLabel nodeId={nodeId} nodeData={nodeData} labelHoverButtons={labelHoverButtons} />
            </div>
        </li>
    );
};

MokaTreeItem.propTypes = propTypes;
MokaTreeItem.defaultProps = defaultProps;

export default MokaTreeItem;
