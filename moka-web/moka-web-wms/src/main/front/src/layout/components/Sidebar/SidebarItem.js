import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { NavLink, useHistory } from 'react-router-dom';
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
    const { nodeData, match } = props;
    const history = useHistory();

    return (
        <li
            className={clsx('sidebar-item', {
                active: match.path === nodeData.menuUrl,
            })}
        >
            <NavLink
                to={nodeData.menuUrl}
                className="sidebar-link"
                activeClassName="active"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // if (match.path !== nodeData.menuUrl) {
                    history.push(nodeData.menuUrl);
                    // }
                }}
            >
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
