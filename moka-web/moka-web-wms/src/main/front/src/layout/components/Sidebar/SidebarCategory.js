import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Collapse from 'react-bootstrap/Collapse';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * 노드 데이터
     */
    nodeData: PropTypes.shape({
        menuId: PropTypes.string.isRequired,
        iconName: PropTypes.string,
        menuDispName: PropTypes.string,
    }),
};
const defaultProps = {};

// 사이드바 카테고리(Collapse 영역) 생성
const SidebarCategory = (props) => {
    const { nodeData, children, open, onClick } = props;
    const controls = `sidebar-collapse-${nodeData.menuId}`;

    return (
        <li className={clsx('sidebar-item', { active: open })}>
            <span className={clsx('sidebar-link', { collapsed: !open })} onClick={onClick} aria-controls={controls} aria-expanded={open} data-toggle="collapse">
                {nodeData.iconName && (
                    <span className="align-middle">
                        <MokaIcon iconName={nodeData.iconName} />
                    </span>
                )}
                <span className="align-middle">{nodeData.menuDisplayNm}</span>
            </span>
            <Collapse in={open} timeout={3000}>
                <div id={controls}>
                    <ul id="item" className="sidebar-dropdown list-unstyled">
                        {children}
                    </ul>
                </div>
            </Collapse>
        </li>
    );
};

SidebarCategory.propTypes = propTypes;
SidebarCategory.defaultProps = defaultProps;

export default SidebarCategory;
