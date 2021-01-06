import React from 'react';
import { Link } from 'react-router-dom';

import Breadcrumb from 'react-bootstrap/Breadcrumb';

/**
 * Navbar에 들어가는 breadcrumb
 */
const MokaBreadcrumb = ({ displayName, match }) => {
    return (
        <Breadcrumb listProps={{ className: 'mb-0 bg-white p-0 pl-3 pr-3' }}>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: match?.path }}>
                {displayName}
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

export default MokaBreadcrumb;
