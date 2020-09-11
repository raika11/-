import React from 'react';

// layout
import { NoFrame } from '@layout';
import Page404 from '@page/MokaAuth/Page404';

// page
const MokaDashBoard = React.lazy(() => import('@page/MokaDashboard'));

const routes = [
    {
        path: '/',
        name: 'Default',
        component: MokaDashBoard,
        layout: NoFrame,
        layoutClassName: 'non-responsive',
        exact: true
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: MokaDashBoard,
        layout: NoFrame,
        layoutClassName: 'non-responsive',
        exact: true
    },
    {
        path: '/404',
        name: 'Page404',
        component: () => <Page404 defaultLink="/" />,
        layout: NoFrame
    }
];

export default routes;
