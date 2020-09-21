import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Nav from 'react-bootstrap/Nav';
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

import menu from './menu.json';

// 아이콘 등록
library.add(faCoffee);

// routes => api 변경
// import routes from '@/routes';

const Sidebar = (props) => {
    const { nonResponsive } = props;
    const location = useLocation();
    const nodes = menu.resultInfo.body.nodes.nodes;
    const [toggle, setToggle] = useState({});

    const { isOpen, isSticky } = useSelector((state) => ({
        isOpen: state.layout.isOpen,
        isSticky: state.layout.isSticky
    }));

    useEffect(() => {
        const expandNodes = nodes.filter((node) => node.nodes);
        const newObj = expandNodes.reduce((result, item, idx, array) => {
            result[item.menuId] = false;
            return result;
        }, {});
        setToggle(newObj);
    }, [nodes]);

    const toggleChange = ({ menuId }) => {
        let neo = toggle;
        toggle[menuId] = !toggle[menuId];
        setToggle(neo);
    };

    const ToggleAction = ({ children, nodeData, isOpen, eventKey, onClick }) => {
        const decoratedOnClick = useAccordionToggle(eventKey, onClick);
        return (
            <>
                <span
                    data-toggle="collapse"
                    className={clsx('sidebar-link', { collapsed: !isOpen })}
                    aria-expanded={isOpen ? 'true' : 'false'}
                    onClick={decoratedOnClick}
                >
                    {nodeData.iconName && (
                        <FontAwesomeIcon icon={nodeData.iconName} className="align-middle mr-3" />
                    )}
                    <span className="align-middle">{nodeData.menuDispName}</span>
                </span>
                <Accordion.Collapse eventKey={eventKey}>{children}</Accordion.Collapse>
            </>
        );
    };

    const SidebarCategory = ({ nodeData, isOpen, onClick, children }) => {
        const getSidebarItemClass = (path) => {
            if (location.pathname) {
                return location.pathname.indexOf(path) !== -1 ||
                    (location.pathname === '/' && path === '/dashboard')
                    ? 'active'
                    : '';
            }
            return '';
        };

        return (
            <li
                className={clsx('sidebar-item', { active: getSidebarItemClass(nodeData.menuPath) })}
            >
                <Accordion>
                    <ToggleAction
                        nodeData={nodeData}
                        isOpen={isOpen}
                        eventKey={nodeData.menuDispName}
                        onClick={onClick}
                    >
                        <ul id="item" className={clsx('sidebar-dropdown list-unstyled')}>
                            {children}
                        </ul>
                    </ToggleAction>
                </Accordion>
            </li>
        );
    };

    const SidebarItem = ({ nodeData }) => {
        const getSidebarItemClass = (path) => {
            if (location.pathname) {
                return location.pathname === path ? 'active' : '';
            }
            return '';
        };
        return (
            <li
                className={clsx('sidebar-item', { active: getSidebarItemClass(nodeData.menuPath) })}
            >
                <Nav.Link to={nodeData.menuPath} className="sidebar-link">
                    {nodeData.iconName && (
                        <FontAwesomeIcon icon={nodeData.iconName} className="align-middle mr-3" />
                    )}
                    {nodeData.menuDispName}
                </Nav.Link>
            </li>
        );
    };

    return (
        <nav
            className={clsx('sidebar', {
                toggled: !isOpen && !nonResponsive,
                'sidebar-sticky': isSticky && !nonResponsive
            })}
        >
            <div className="sidebar-content">
                <PerfectScrollbar>
                    <Link className="sidebar-brand" to="/">
                        <span className="align-middle">The JoongAng</span>
                    </Link>

                    <ul className="sidebar-nav">
                        {nodes.map((node, idx) =>
                            node.nodes ? (
                                <SidebarCategory
                                    key={node.menuId}
                                    nodeData={node}
                                    isOpen={toggle[node.menuId]}
                                    onClick={() => toggleChange(node)}
                                >
                                    {node.nodes.nodes.map((no, idx2) => (
                                        <SidebarItem key={idx2} nodeData={no} />
                                    ))}
                                </SidebarCategory>
                            ) : (
                                <SidebarItem key={node.menuId} nodeData={node} />
                            )
                        )}
                    </ul>
                </PerfectScrollbar>
            </div>
        </nav>
    );
};

export default Sidebar;
