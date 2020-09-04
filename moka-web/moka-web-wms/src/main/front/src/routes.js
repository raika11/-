import React from 'react';

const Test = React.lazy(() => import('./pages/Test'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Dataset = React.lazy(() => import('./pages/Dataset'));
const Template = React.lazy(() => import('./pages/Template'));
const Container = React.lazy(() => import('./pages/Container'));
const Component = React.lazy(() => import('./pages/Component'));
const Page = React.lazy(() => import('./pages/Page'));
const Domain = React.lazy(() => import('./pages/Domain'));
const Resource = React.lazy(() => import('./pages/Resource'));
const Reserved = React.lazy(() => import('./pages/Reserved'));
const etccodeType = React.lazy(() => import('./pages/EtccodeType'));
const desking = React.lazy(() => import('./pages/Desking'));
const Volume = React.lazy(() => import('./pages/Volume'));
const Easytest = React.lazy(() => import('./pages/Easytest'));

const routes = [
    {
        path: '/dashboard',
        displayName: 'Dashboard',
        component: Dashboard,
        exact: true
    },
    {
        path: '/test',
        displayName: 'test',
        component: Test,
        exact: true
    },
    {
        path: '/test/:datasetSeq',
        displayName: 'test',
        component: Test,
        exact: true
    },
    {
        path: '/template',
        displayName: 'template',
        component: Template,
        strict: true
    },
    {
        path: '/container',
        displayName: 'container',
        component: Container,
        strict: true
    },
    {
        path: '/component',
        displayName: 'component',
        component: Component,
        strict: true
    },
    {
        path: '/dataset',
        displayName: 'dataset',
        component: Dataset,
        strict: true
    },
    {
        path: '/page',
        displayName: 'page',
        component: Page,
        strict: true
    },
    {
        path: '/domain',
        displayName: 'page',
        component: Domain,
        strict: true
    },
    {
        path: '/resource',
        displayName: 'resource',
        component: Resource,
        strict: true
    },
    {
        path: '/reserved',
        displayName: 'reserved',
        component: Reserved,
        strict: true
    },
    {
        path: '/etccodeType',
        displayName: 'etccodeType',
        component: etccodeType,
        strict: true
    },
    {
        path: '/desking',
        displayName: 'desking',
        component: desking,
        strict: true
    },
    {
        path: '/easytest',
        displayName: 'easytest',
        component: Easytest,
        strict: true
    },
    {
        path: '/volume',
        displayName: 'volume',
        component: Volume,
        strict: true
    }
];

export default routes;
