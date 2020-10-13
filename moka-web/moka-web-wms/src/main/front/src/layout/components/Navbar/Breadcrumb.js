import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import routes from '@/routes';

/**
 * Navbar에 들어가는 breadcrumb
 */
const MokaBreadcrumb = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState({
        path: '',
    });

    useEffect(() => {
        const cp = routes.find((route) => !route.exact && location.pathname.indexOf(route.path) > -1);
        setCurrentPage(cp);
    }, [location]);

    return (
        <Breadcrumb listProps={{ className: 'mb-0 bg-white p-0 pl-3 pr-3' }}>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: currentPage.path }}>
                {currentPage.displayName}
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

export default MokaBreadcrumb;
