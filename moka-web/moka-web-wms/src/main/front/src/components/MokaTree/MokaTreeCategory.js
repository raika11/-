import React, { useState } from 'react';

import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import { MokaIcon } from '@components';
import MokaTreeLabel from './MokaTreeLabel';

const MokaTreeCategory = (props) => {
    const { pageName, id, children, onExpanded, onInsert, onDelete } = props;
    const [open, setOpen] = useState(false);
    const controls = `sidebar-collapse-${id}`;

    const handleExpanded = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open);

        if (onExpanded) {
            onExpanded();
        }
    };

    return (
        <li className="tree-category">
            <div className="tree-label" aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <Button size="sm" className="mr-1" onClick={handleExpanded}>
                    <MokaIcon iconName={open ? 'fal-minus' : 'fal-plus'} />
                </Button>
                <MokaTreeLabel pageaName={pageName} onInsert={onInsert} onDelete={onDelete} />
            </div>
            <Collapse in={open} timeout={300}>
                <div id={controls}>
                    <ul id="item" className="list-unstyled">
                        {children}
                    </ul>
                </div>
            </Collapse>
        </li>
    );
};

export default MokaTreeCategory;
