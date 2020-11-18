import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import { MokaIcon } from '@components';
import MokaTreeLabel from './MokaTreeLabel';

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
     * 확장 노드 리스트
     */
    expanded: PropTypes.array,
    /**
     * 노드 확장/축소 콜백
     */
    onExpansion: PropTypes.func,
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
const defaultProps = {
    expanded: [],
};

const MokaTreeCategory = (props) => {
    const { nodeId, selected, nodeData, children, expanded, onExpansion, onSelected, labelHoverButtons } = props;
    const { depth, usedYn, match } = nodeData;
    const [open, setOpen] = useState(false);
    const controls = `sidebar-collapse-${nodeId}`;

    useEffect(() => {
        if (expanded.filter((ex) => String(ex) === nodeId).length > 0) {
            setOpen(true);
        }
    }, [expanded, nodeId]);

    /**
     * collapse 확장/축소
     */
    const handleExpanded = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open);

        if (onExpansion) {
            onExpansion(nodeData, e);
        }
    };

    /**
     * 노드 선택시 실행
     */
    const handleSelected = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onSelected) {
            onSelected(nodeData, e);
        }
    };

    return (
        <li className="tree-category" key={nodeId} onClick={handleSelected} data-depth={depth} data-usedyn={usedYn}>
            <div className={clsx('tree-label', { selected: nodeId === selected })} aria-controls={controls} aria-expanded={open} data-toggle="collapse" data-match={match}>
                <Button size="sm" variant="searching" className="mr-1" onClick={handleExpanded}>
                    <MokaIcon iconName={open ? 'fal-minus' : 'fal-plus'} />
                </Button>
                <MokaTreeLabel nodeId={nodeId} nodeData={nodeData} labelHoverButtons={labelHoverButtons} />
            </div>
            <Collapse in={open} timeout={3000}>
                <div id={controls}>
                    <ul id="item" className="list-unstyled">
                        {children}
                    </ul>
                </div>
            </Collapse>
        </li>
    );
};

MokaTreeCategory.propTypes = propTypes;
MokaTreeCategory.defaultProps = defaultProps;

export default MokaTreeCategory;
