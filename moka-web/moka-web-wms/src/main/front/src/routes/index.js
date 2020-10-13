import React from 'react';

// layout
import { NoFrameLayout, SidebarOpenLayout, SidebarCloseLayout } from '@layout';
import Page404 from '@pages/Auth/Page404';
import Domain from '@/pages/Domain/Domain';

// page
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const TestBoard = React.lazy(() => import('@pages/TestBoard'));
const Task = React.lazy(() => import('@pages/Task'));
const EmbedVideo = React.lazy(() => import('@pages/EmbedVideo'));
const AgGrid = React.lazy(() => import('@pages/AgGrid'));
const Page = React.lazy(() => import('@pages/Page'));

const routes = [
    {
        path: '/',
        name: 'Default',
        displayName: '홈',
        component: Dashboard,
        layout: SidebarCloseLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/dashboard',
        name: 'DashBoard',
        displayName: '대시보드',
        component: Dashboard,
        layout: SidebarOpenLayout,
        nonResponsive: true,
    },
    {
        path: '/404',
        name: 'Page404',
        displayName: '404',
        component: () => <Page404 defaultLink="/dashboard" />,
        layout: NoFrameLayout,
    },
    {
        path: '/test',
        name: 'Test',
        displayName: '테스트페이지',
        component: TestBoard,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/aggrid',
        name: 'AgGrid',
        displayName: 'AgGrid',
        component: AgGrid,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/tasks',
        name: 'Task',
        displayName: 'Task',
        component: Task,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/embed-video',
        name: 'EmbedVideo',
        displayName: 'EmbedVideo',
        component: EmbedVideo,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: true,
    },
    {
        path: '/page',
        name: 'Page',
        displayName: '페이지관리',
        component: Page,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: true,
    },
    {
        path: '/domain',
        name: 'Domain',
        displayName: '도메인관리',
        component: Domain,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: true,
    },
];

export default routes;
