import React from 'react';

// layout
import { NoFrameLayout, SidebarCloseLayout, SidebarOpenLayout } from '@layout';
import Page404 from '@pages/Auth/Page404';
import ComponentDashboard from '@pages/Dashboard/ComponentDashboard';
import Page403 from '@pages/Auth/Page403';

// page
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Desking = React.lazy(() => import('@pages/Desking'));
const TestBoard = React.lazy(() => import('@pages/TestBoard'));
const Task = React.lazy(() => import('@pages/Task'));
const EmbedVideo = React.lazy(() => import('@pages/EmbedVideo'));
const AgGrid = React.lazy(() => import('@pages/AgGrid'));
const Page = React.lazy(() => import('@pages/Page'));
const Domain = React.lazy(() => import('@pages/Domain'));
const Template = React.lazy(() => import('@pages/Template'));
const Dataset = React.lazy(() => import('@pages/Dataset'));
const Container = React.lazy(() => import('@pages/Container'));
const Reserved = React.lazy(() => import('@pages/Reserved'));
const Component = React.lazy(() => import('@pages/Component'));
const CodeMgt = React.lazy(() => import('@pages/CodeMgt'));
const EditForm = React.lazy(() => import('@pages/EditForm'));
const Area = React.lazy(() => import('@pages/Area'));
const Menu = React.lazy(() => import('@pages/Menu'));
const Group = React.lazy(() => import('@pages/Group'));
const Reporter = React.lazy(() => import('@pages/Reporter'));
const Special = React.lazy(() => import('@pages/Special'));
const DirectLink = React.lazy(() => import('@pages/DirectLink'));
const Member = React.lazy(() => import('@pages/Member'));
const Columnist = React.lazy(() => import('@pages/Columnist'));

const routes = [
    {
        path: '/desking',
        name: 'Desking',
        displayName: '페이지편집',
        component: Desking,
        layout: SidebarCloseLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/',
        name: 'DashBoard',
        displayName: '대시보드',
        component: Dashboard,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: true,
    },
    {
        path: '/404',
        name: 'Page404',
        displayName: '404',
        component: () => <Page404 defaultLink="/" />,
        layout: NoFrameLayout,
    },
    {
        path: '/403',
        name: 'Page403',
        displayName: '403',
        component: () => <Page403 defaultLink="/" />,
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
        strict: true,
        exact: false,
    },
    {
        path: '/domain',
        name: 'Domain',
        displayName: '도메인관리',
        component: Domain,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
    },
    {
        path: '/template',
        name: 'Template',
        displayName: '템플릿관리',
        component: Template,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/dataset',
        name: 'Dataset',
        displayName: '데이터셋관리',
        component: Dataset,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/container',
        name: 'Container',
        displayName: '컨테이너관리',
        component: Container,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/reserved',
        name: 'Reserved',
        displayName: '예약어관리',
        component: Reserved,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/component',
        name: 'Component',
        displayName: '컴포넌트관리',
        component: Component,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/codeMgt',
        name: 'CodeMgt',
        displayName: '기타코드관리',
        component: CodeMgt,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/edit-form',
        name: 'edit-form',
        displayName: 'Edit Form',
        component: EditForm,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/area',
        name: 'area',
        displayName: '편집영역관리',
        component: Area,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/menu',
        name: 'menu',
        displayName: '메뉴관리',
        component: Menu,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/group',
        name: 'group',
        displayName: '그룹관리',
        component: Group,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/reporter',
        name: 'reporter',
        displayName: '기자관리',
        component: Reporter,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/special',
        name: 'Special',
        displayName: '디지털 스페셜 관리',
        component: Special,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/component-dashboard',
        name: 'component-dashboard',
        displayName: '컴포넌트 테스트용 대시보드',
        component: ComponentDashboard,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/direct-link',
        name: 'direct-link',
        displayName: '사이트 바로 가기',
        component: DirectLink,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/member',
        name: 'member',
        displayName: '사용자 관리',
        component: Member,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/columnist',
        name: 'columnist',
        displayName: '칼럼니스트 관리',
        component: Columnist,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
];

export default routes;
