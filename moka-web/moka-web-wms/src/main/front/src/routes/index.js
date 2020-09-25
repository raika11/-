import React from 'react';

// layout
import { NoFrameLayout, SidebarOpenLayout, SidebarCloseLayout } from '@layout';
import Page404 from '@pages/MokaAuth/Page404';

// page
const MokaDashBoard = React.lazy(() => import('@pages/MokaDashboard'));
const TestBoard = React.lazy(() => import('@pages/TestBoard'));
const Task = React.lazy(() => import('@pages/Task'));
const EmbedVideo = React.lazy(() => import('@pages/EmbedVideo'));
const AgGrid = React.lazy(() => import('@pages/AgGrid'));

const routes = [
    {
        path: '/',
        name: 'Default',
        component: MokaDashBoard,
        layout: SidebarCloseLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/dashboard',
        name: 'DashBoard',
        component: MokaDashBoard,
        layout: SidebarOpenLayout,
        nonResponsive: true,
    },
    {
        path: '/404',
        name: 'Page404',
        component: () => <Page404 defaultLink="/dashboard" />,
        layout: NoFrameLayout,
    },
    {
        path: '/test',
        name: 'Test',
        component: TestBoard,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/aggrid',
        name: 'AgGrid',
        component: AgGrid,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/tasks',
        name: 'Task',
        component: Task,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/embed-video',
        name: 'EmbedVideo',
        component: EmbedVideo,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true
    }
];

export default routes;
