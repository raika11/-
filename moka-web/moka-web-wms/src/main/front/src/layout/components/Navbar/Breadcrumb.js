import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const defaultProps = {
    match: {},
    menuPaths: {},
    menuById: {},
};

/**
 * Navbar에 들어가는 breadcrumb
 */
const MokaBreadcrumb = ({ match, menuPaths, menuById }) => {
    const [parent, setParent] = useState([]);
    const [current, setCurrent] = useState({});

    const findParent = useCallback((menuById, current, resultList) => {
        const returnVal = resultList;
        if (current.parentMenuId && current.parentMenuId !== '00') {
            const pa = menuById[current.parentMenuId];
            if (pa) {
                returnVal.unshift(pa);
                if (pa.parentMenuId && pa.parentMenuId !== '00') {
                    return findParent(menuById, pa, resultList);
                }
            }
        }
        return returnVal;
    }, []);

    useEffect(() => {
        if (match.path && menuPaths[match.path]) {
            const cid = menuPaths[match.path];
            const result = findParent(menuById, menuById[cid], []);
            setParent(result);
            setCurrent(menuById[cid]);
        }
    }, [menuPaths, match, findParent, menuById]);

    return (
        <Breadcrumb listProps={{ className: 'mb-0 bg-white p-0 pl-3 pr-3' }}>
            {parent.map((data) => (
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
