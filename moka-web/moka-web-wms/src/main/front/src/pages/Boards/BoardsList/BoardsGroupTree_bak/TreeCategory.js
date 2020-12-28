import React, { useState, useEffect } from 'react';
import { MokaLoader, MokaCard } from '@components';
import clsx from 'clsx';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import { MokaIcon } from '@components';

const TreeCategory = (props) => {
    const { nodeId, nodeData, selected, children, expanded, onExpansion, onSelected } = props;
    const [open, setOpen] = useState(false);
    const controls = `sidebar-collapse-${nodeId}`;

    /**
     * collapse 확장/축소
     */
    const handleExpanded = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open);

        if (onExpansion) {
            onExpansion(nodeData);
        }
    };

    /**
     * 노드 선택시 실행
     */
    const handleSelected = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onSelected) {
            onSelected(nodeData);
        }
        if (!open) {
            if (onExpansion) {
                onExpansion(nodeData);
            }
        }
    };
    const tempEvent = () => {};
    return (
        <li className="tree-category" key={nodeId} onClick={handleSelected}>
            <div className={clsx('tree-label', { selected: nodeId === selected })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <Button size="sm" variant="searching" className="mr-1 flex-shrink-0" onClick={handleExpanded}>
                    <MokaIcon iconName={open ? 'fal-minus' : 'fal-plus'} />
                </Button>
                <span className="font-weight-bold" onClick={tempEvent}>
                    Item
                </span>
            </div>
            <Collapse in={open} timeout={0}>
                <div id={controls}>
                    <ul id="item" className="list-unstyled">
                        {children}
                    </ul>
                </div>
            </Collapse>
        </li>
    );
};

export default TreeCategory;
