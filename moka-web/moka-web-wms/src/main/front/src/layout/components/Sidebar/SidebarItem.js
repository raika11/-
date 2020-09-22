import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import SidebarItemIcon from './SidebarItemIcon';

const propTypes = {
    /**
     * 노드 데이터
     */
    nodeData: PropTypes.shape({
        menuPath: PropTypes.any,
        iconName: PropTypes.string,
        menuDispName: PropTypes.string
    })
};
const defaultProps = {};

// 사이드바 아이템 생성
const SidebarItem = (props) => {
    const { nodeData } = props;
    const location = useLocation();

    return (
        <li
            className={clsx('sidebar-item', {
                active: location.pathname === nodeData.menuPath || null
            })}
        >
            <NavLink to={nodeData.menuPath || ''} className="sidebar-link" activeClassName="active">
                <SidebarItemIcon iconName={nodeData.iconName} />
                {nodeData.menuDispName}
            </NavLink>
        </li>
    );
};

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;
