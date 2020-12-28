import React, { useState, useEffect } from 'react';
import { MokaLoader, MokaCard } from '@components';
import clsx from 'clsx';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import { MokaIcon } from '@components';

const TreeCategory = (props) => {
    const { listIndex, nodeData, selected, onSelected, children, expanded, onExpansion } = props;
    const [open, setOpen] = useState(false);
    const controls = `sidebar-collapse-${listIndex}`;

    const handleClickCategory = () => {
        setOpen(!open);
    };

    useEffect(() => {
        console.log(open);
    }, [open]);

    useEffect(() => {
        const setFirstSelected = () => {
            setOpen(true);
        };

        if (listIndex === selected) {
            setFirstSelected();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <li className="tree-category" key={listIndex} onClick={() => handleClickCategory()}>
            <div className={clsx('tree-label', { selected: listIndex === selected })} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                <Button size="sm" variant="searching" className="mr-1 flex-shrink-0" onClick={() => handleClickCategory()}>
                    <MokaIcon iconName={open ? 'fal-minus' : 'fal-plus'} />
                </Button>
                <span>{nodeData.boardTypeName}</span>
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
