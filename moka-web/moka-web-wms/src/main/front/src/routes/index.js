import React from 'react';

// layout
import { NoFrameLayout, SidebarCloseLayout, SidebarOpenLayout } from '@layout';
import Page404 from '@pages/Auth/Page404';
import ComponentDashboard from '@pages/Dashboard/ComponentDashboard';
import Page403 from '@pages/Auth/Page403';

function retry(fn, retriesLeft = 2, interval = 1000) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                setTimeout(() => {
                    if (retriesLeft === 1) {
                        // reject('maximum retries exceeded');
                        window.location.reload();
                        reject(error);
                        return;
                    }
                    // Passing on "reject" is the important part
                    retry(fn, retriesLeft - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
}

// page
const Dashboard = React.lazy(() => retry(() => import('@pages/Dashboard')));
const Desking = React.lazy(() => retry(() => import('@pages/Desking')));
const AgGrid = React.lazy(() => retry(() => import('@pages/AgGrid')));
const Page = React.lazy(() => retry(() => import('@pages/Page')));
const Domain = React.lazy(() => retry(() => import('@pages/Domain')));
const Template = React.lazy(() => retry(() => import('@pages/Template')));
const Dataset = React.lazy(() => retry(() => import('@pages/Dataset')));
const Container = React.lazy(() => retry(() => import('@pages/Container')));
const Reserved = React.lazy(() => retry(() => import('@pages/Reserved')));
const Component = React.lazy(() => retry(() => import('@pages/Component')));
const CodeMgt = React.lazy(() => retry(() => import('@pages/CodeMgt')));
const EditForm = React.lazy(() => retry(() => import('@pages/EditForm')));
const Area = React.lazy(() => retry(() => import('@pages/Area')));
const Menu = React.lazy(() => retry(() => import('@pages/Menu')));
const Group = React.lazy(() => retry(() => import('@pages/Group')));
const Reporter = React.lazy(() => retry(() => import('@pages/Reporter')));
const Special = React.lazy(() => retry(() => import('@pages/Special')));
const DirectLink = React.lazy(() => retry(() => import('@pages/DirectLink')));
const Member = React.lazy(() => retry(() => import('@pages/Member')));
const Columnist = React.lazy(() => retry(() => import('@pages/Columnist')));
const SnsMeta = React.lazy(() => retry(() => import('@pages/SnsManage/SnsMeta')));
const FbArt = React.lazy(() => retry(() => import('@pages/SnsManage/FbArt')));
const ArticlePage = React.lazy(() => retry(() => import('@pages/ArticlePage')));
const Bulks = React.lazy(() => retry(() => import('@pages/Bulks')));
const ArticleSource = React.lazy(() => retry(() => import('@pages/ArticleSource')));
const Poll = React.lazy(() => retry(() => import('@pages/Survey/Poll')));
const RcvArticle = React.lazy(() => retry(() => import('@pages/RcvArticle')));
const Comment = React.lazy(() => retry(() => import('@pages/CommentManage/Comment')));
const Boards = React.lazy(() => retry(() => import('@pages/Boards')));
const Tour = React.lazy(() => retry(() => import('@pages/Tour')));
const Article = React.lazy(() => retry(() => import('@pages/Article')));
const Quiz = React.lazy(() => retry(() => import('@pages/Survey/Quiz')));
const CommentBanned = React.lazy(() => retry(() => import('@pages/CommentManage/Banned')));
const Mic = React.lazy(() => retry(() => import('@pages/Mic')));
const SEOMeta = React.lazy(() => retry(() => import('@pages/SEOMeta')));
const SearchKeyword = React.lazy(() => retry(() => import('@pages/Search/SearchKeyword')));
const JpodChannel = React.lazy(() => retry(() => import('@pages/Jpod/JpodChannel')));
const JpodEpisode = React.lazy(() => retry(() => import('@pages/Jpod/JpodEpisode')));
const EditLog = React.lazy(() => retry(() => import('@pages/EditLog')));
const SystemMonitor = React.lazy(() => retry(() => import('@pages/SystemMonitor')));
const BulkMonitor = React.lazy(() => retry(() => import('@pages/BulkMonitor')));
const InternalApi = React.lazy(() => retry(() => import('@pages/InternalApi')));
const Package = React.lazy(() => retry(() => import('@pages/Package')));

const routes = [
    {
        path: '/desking',
        name: 'Desking',
        displayName: '페이지편집',
        component: Desking,
        layout: SidebarCloseLayout,
        nonResponsive: true,
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
        path: '/aggrid',
        name: 'AgGrid',
        displayName: 'AgGrid',
        component: AgGrid,
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
        path: '/code-mgt',
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
        nonResponsive: false,
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
    {
        path: '/sns-meta',
        name: 'sns-meta',
        displayName: 'FB & TW 관리',
        component: SnsMeta,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/fb-art',
        name: 'fb-art',
        displayName: 'FB전송기사 관리',
        component: FbArt,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article-page',
        name: 'article-page',
        displayName: '기사페이지 관리',
        component: ArticlePage,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkn-ja',
        name: 'bulkn-ja',
        displayName: '네이버 벌크 문구 관리',
        component: Bulks,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkh-ja',
        name: 'bulkh-ja',
        displayName: '아티클 핫클릭',
        component: Bulks,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkn-su',
        name: 'bulkn-su',
        displayName: '선데이 네이버 벌크 문구 관리',
        component: Bulks,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkh-su',
        name: 'bulkh-su',
        displayName: '선데이 아티클 핫클릭',
        component: Bulks,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article-sources',
        name: 'article-sources',
        displayName: '수신 매체 관리',
        component: ArticleSource,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/poll',
        name: 'poll',
        displayName: '투표 관리',
        component: Poll,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/quiz',
        name: 'quiz',
        displayName: '퀴즈 관리',
        component: Quiz,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/rcv-article',
        name: 'rcv-article',
        displayName: '수신 기사 전체',
        component: RcvArticle,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/comment',
        name: 'Comment',
        displayName: '댓글 관리',
        component: Comment,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boarda-set',
        name: 'boarda-set',
        displayName: '전체 게시판 관리',
        component: Boards,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boards-set',
        name: 'boards-set',
        displayName: '전체 게시판 관리',
        component: Boards,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-month',
        name: '/tour-month',
        displayName: '월별 현황',
        component: Tour,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-list',
        name: '/tour-list',
        displayName: '신청 목록',
        component: Tour,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-set',
        name: 'tour-set',
        displayName: '기본 설정',
        component: Tour,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-message',
        name: 'tour-message',
        displayName: '메세지 설정',
        component: Tour,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article',
        name: 'article',
        displayName: '등록 기사 전체',
        component: Article,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/article-ja',
        name: 'articleJa',
        displayName: '등록 기사 - 중앙일보',
        component: Article,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/article-sun',
        name: 'articleSun',
        displayName: '등록 기사 - 중앙선데이',
        component: Article,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/boarda-list',
        name: 'boarda-list',
        displayName: '게시글 게시판 관리',
        component: Boards,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boards-list',
        name: 'boards-list',
        displayName: '게시글 게시판 관리',
        component: Boards,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-id',
        name: 'Banned-id',
        displayName: '차단ID 관리',
        component: CommentBanned,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-ip',
        name: 'Banned-ip',
        displayName: '차단IP 관리',
        component: CommentBanned,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-word',
        name: 'Banned-word',
        displayName: '금지어 관리',
        component: CommentBanned,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/mic',
        name: 'mic',
        displayName: '시민 마이크',
        component: Mic,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/seo-meta',
        name: 'seo-meta',
        displayName: 'SEO 메타관리',
        component: SEOMeta,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/cdn-article',
        name: 'cdnArticle',
        displayName: '트래픽 분산(기사) 관리',
        component: SystemMonitor,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/search-keyword',
        name: 'searchKeyword',
        displayName: '검색 로그',
        component: SearchKeyword,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-channel',
        name: 'jpod-channel',
        displayName: 'Jpod 채널관리',
        component: JpodChannel,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-episode',
        name: 'jpod-episode',
        displayName: 'Jpod 에피소드관리',
        component: JpodEpisode,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/edit-log',
        name: 'editLog',
        displayName: '로그 관리',
        component: EditLog,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulk-monitor-ja',
        name: 'bulk-monitor-ja',
        displayName: '벌크 모니터링',
        component: BulkMonitor,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/internal-api',
        name: 'internalApi',
        displayName: 'API 관리',
        component: InternalApi,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/schedule',
        name: 'schedule',
        displayName: '스케줄 서버 관리',
        component: SystemMonitor,
        layout: SidebarOpenLayout,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/package',
        name: 'package',
        displayName: '패키지 관리',
        component: Package,
        layout: SidebarOpenLayout,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
];

export default routes;
