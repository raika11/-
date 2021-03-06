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

const DeskingTreeCategory = (props) => {
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

    useEffect(() => {
        if (expanded.filter((ex) => String(ex) === nodeId).length > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [expanded, nodeId]);

    return (
        <li className="tree-category" key={nodeId} onClick={handleSelected}>
            <div className={clsx('tree-label', { selected: nodeId === selected })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <Button
                    size="sm"
                    variant={nodeId === selected ? 'info' : 'searching'}
                    className="mr-1 d-flex align-items-center justify-content-center flex-shrink-0"
                    onClick={handleExpanded}
                >
                    <MokaIcon iconName={open ? 'fal-minus' : 'fal-plus'} />
                </Button>
                <DeskingTreeLabel nodeId={nodeId} nodeData={nodeData} onClick={handleSelected} />
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

DeskingTreeCategory.propTypes = propTypes;
DeskingTreeCategory.defaultProps = defaultProps;

export default DeskingTreeCategory;
