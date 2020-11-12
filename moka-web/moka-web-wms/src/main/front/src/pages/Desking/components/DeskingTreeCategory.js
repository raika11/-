import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import { MokaIcon } from '@components';
import DeskingTreeLabel from './DeskingTreeLabel';

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
    nodeData: PropTypes.object.isRequired,
};
const defaultProps = {
    expanded: [],
};

/**
 * 데스킹 트리 카테고리 컴포넌트
 */
const DeskingTreeCategory = (props) => {
    const { nodeId, nodeData, selected, children, expanded, onExpansion, onSelected } = props;
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
            onExpansion(e);
        }
    };

    /**
     * 노드 선택시 실행
     */
    const handleSelected = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onSelected) {
            onSelected(e);
        }
    };

    return (
        <li className="tree-category" key={nodeId} onClick={handleSelected}>
            <div className={clsx('tree-label', { selected: nodeId === selected })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <Button size="sm" className="mr-1" onClick={handleExpanded}>
                    <MokaIcon iconName={open ? 'fal-minus' : 'fal-plus'} />
                </Button>
                <DeskingTreeLabel nodeId={nodeId} nodeData={nodeData} onClick={handleExpanded} />
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

DeskingTreeCategory.propTypes = propTypes;
DeskingTreeCategory.defaultProps = defaultProps;

export default DeskingTreeCategory;
