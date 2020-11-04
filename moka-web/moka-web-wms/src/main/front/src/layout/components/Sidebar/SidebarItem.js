import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * 노드 데이터
     */
    nodeData: PropTypes.shape({
        menuPath: PropTypes.any,
        iconName: PropTypes.string,
        menuDispName: PropTypes.string,
    }),
};
const defaultProps = {};

// 사이드바 아이템 생성
const SidebarItem = (props) => {
    const { nodeData } = props;
    const location = useLocation();
    let localPath = '';
    let menuPath = '';
    let openMenu = false;
    if (location.pathname === '/') {
        localPath = location.pathname;
    } else if (location.pathname.length > 0) {
        localPath = location.pathname.split('/')[1];
    }

    if (nodeData.menuUrl === '/') {
        menuPath = nodeData.menuUrl;
    } else if (nodeData.menuUrl.length > 0) {
        menuPath = nodeData.menuUrl.split('/')[1];
    }
    if (localPath === menuPath) {
        openMenu = true;
    }
    return (
        <li
            className={clsx('sidebar-item', {
                active: openMenu || null,
            })}
        >
            <NavLink to={openMenu ? location.pathname : nodeData.menuUrl} className="sidebar-link" activeClassName="active">
                {nodeData.iconName && (
                    <span className="align-middle">
                        <MokaIcon iconName={nodeData.iconName} />
                    </span>
                )}
                {nodeData.menuDisplayNm}
            </NavLink>
        </li>
    );
};

SidebarItem.propTypes = propTypes;
SidebarItem.defaultProps = defaultProps;

export default SidebarItem;
