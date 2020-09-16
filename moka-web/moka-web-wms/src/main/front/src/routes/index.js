import React from 'react';

// layout
import { NoFrame, DefaultLayout } from '@layout';
import Page404 from '@page/MokaAuth/Page404';

// page
const MokaDashBoard = React.lazy(() => import('@page/MokaDashboard'));
const TestBoard = React.lazy(() => import('@page/TestBoard'));

const routes = [
    {
        path: '/',
        name: 'Default',
        component: MokaDashBoard,
        layout: DefaultLayout,
        nonResponsive: false,
        exact: true
    },
    {
        path: '/404',
        name: 'Page404',
        component: () => <Page404 defaultLink="/" />,
        layout: NoFrame
    },
    {
        path: '/test',
        name: 'Test',
        component: TestBoard,
        layout: DefaultLayout,
        nonResponsive: false,
        exact: true
    }
];

export default routes;
