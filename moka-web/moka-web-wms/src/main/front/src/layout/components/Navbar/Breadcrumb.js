import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useSelector } from 'react-redux';

const defaultProps = {
    match: {},
    menuPaths: {},
    menuById: {},
};

/**
 * Navbar에 들어가는 breadcrumb
 */
const MokaBreadcrumb = ({ match, menuPaths, menuById, nonResponsive, side, currentMenu }) => {
    const [parents, setParents] = useState([]);
    const [current, setCurrent] = useState({});

    const { menu } = useSelector((store) => ({
        menu: store.auth.menu,
    }));

    useEffect(() => {
        if (currentMenu) {
            setCurrent(currentMenu);
            setParents(currentMenu.parents);
        }
    }, [menuPaths, match, menuById, currentMenu, menu.menuPaths, menu.menuById]);

    return (
        <Breadcrumb listProps={{ className: 'mb-0 bg-white p-0 pl-3 pr-3' }}>
            {parents.map((data) => (
                // 클릭 못하게 하려고 active로 함
                <Breadcrumb.Item key={data.menuId} active>
                    {data.menuDisplayNm}
                </Breadcrumb.Item>
            ))}
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: current.menuUrl }} data-current="true" active>
                {current.menuDisplayNm}
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

MokaBreadcrumb.defaultProps = defaultProps;

export default MokaBreadcrumb;
