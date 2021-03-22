import React from 'react';
import Page404 from '@pages/Auth/Page404'; // 404
import Page403 from '@pages/Auth/Page403'; // 403

// function retry(fn, retriesLeft = 2, interval = 1000) {
//     return new Promise((resolve, reject) => {
//         fn()
//             .then(resolve)
//             .catch((error) => {
//                 setTimeout(() => {
//                     if (retriesLeft === 1) {
//                         // reject('maximum retries exceeded');
//                         window.location.reload();
//                         reject(error);
//                         return;
//                     }
//                     // Passing on "reject" is the important part
//                     retry(fn, retriesLeft - 1, interval).then(resolve, reject);
//                 }, interval);
//             });
//     });
// }

// page
// const Dashboard = React.lazy(() => retry(() => import('@pages/Dashboard')));
// const Desking = React.lazy(() => retry(() => import('@pages/Desking')));
// const Page = React.lazy(() => retry(() => import('@pages/Page')));
// const Domain = React.lazy(() => retry(() => import('@pages/Domain')));
// const Template = React.lazy(() => retry(() => import('@pages/Template')));
// const Dataset = React.lazy(() => retry(() => import('@pages/Dataset')));
// const Container = React.lazy(() => retry(() => import('@pages/Container')));
// const Reserved = React.lazy(() => retry(() => import('@pages/Reserved')));
// const Component = React.lazy(() => retry(() => import('@pages/Component')));
// const CodeMgt = React.lazy(() => retry(() => import('@pages/CodeMgt')));
// const EditForm = React.lazy(() => retry(() => import('@pages/EditForm')));
// const Area = React.lazy(() => retry(() => import('@pages/Area')));
// const Menu = React.lazy(() => retry(() => import('@pages/Menu')));
// const Group = React.lazy(() => retry(() => import('@pages/Group')));
// const Reporter = React.lazy(() => retry(() => import('@pages/Reporter')));
// const Special = React.lazy(() => retry(() => import('@pages/Special')));
// const DirectLink = React.lazy(() => retry(() => import('@pages/DirectLink')));
// const Member = React.lazy(() => retry(() => import('@pages/Member')));
// const Columnist = React.lazy(() => retry(() => import('@pages/Columnist')));
// const SnsMeta = React.lazy(() => retry(() => import('@pages/SnsManage/SnsMeta')));
// const FbArt = React.lazy(() => retry(() => import('@pages/SnsManage/FbArt')));
// const ArticlePage = React.lazy(() => retry(() => import('@pages/ArticlePage')));
// const Bulks = React.lazy(() => retry(() => import('@pages/Bulks')));
// const ArticleSource = React.lazy(() => retry(() => import('@pages/ArticleSource')));
// const Poll = React.lazy(() => retry(() => import('@pages/Survey/Poll')));
// const RcvArticle = React.lazy(() => retry(() => import('@pages/RcvArticle')));
// const Comment = React.lazy(() => retry(() => import('@pages/CommentManage/Comment')));
// const Boards = React.lazy(() => retry(() => import('@pages/Boards')));
// const Tour = React.lazy(() => retry(() => import('@pages/Tour')));
// const Article = React.lazy(() => retry(() => import('@pages/Article')));
// const Quiz = React.lazy(() => retry(() => import('@pages/Survey/Quiz')));
// const CommentBanned = React.lazy(() => retry(() => import('@pages/CommentManage/Banned')));
// const Mic = React.lazy(() => retry(() => import('@pages/Mic')));
// const SEOMeta = React.lazy(() => retry(() => import('@pages/SEOMeta')));
// const SearchKeyword = React.lazy(() => retry(() => import('@pages/Search/SearchKeyword')));
// const JpodChannel = React.lazy(() => retry(() => import('@pages/Jpod/JpodChannel')));
// const JpodEpisode = React.lazy(() => retry(() => import('@pages/Jpod/JpodEpisode')));
// const JpodNotice = React.lazy(() => retry(() => import('@pages/Jpod/JpodNotice')));
// const EditLog = React.lazy(() => retry(() => import('@pages/EditLog')));
// const SystemMonitor = React.lazy(() => retry(() => import('@pages/SystemMonitor')));
// const BulkMonitor = React.lazy(() => retry(() => import('@pages/BulkMonitor')));
// const InternalApi = React.lazy(() => retry(() => import('@pages/InternalApi')));
// const Package = React.lazy(() => retry(() => import('@pages/Package')));
// const Jopan = React.lazy(() => retry(() => import('@pages/Jopan')));

const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Desking = React.lazy(() => import('@pages/Desking'));
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
const SnsMeta = React.lazy(() => import('@pages/SnsManage/SnsMeta'));
const FbArt = React.lazy(() => import('@pages/SnsManage/FbArt'));
const ArticlePage = React.lazy(() => import('@pages/ArticlePage'));
const Bulks = React.lazy(() => import('@pages/Bulks'));
const ArticleSource = React.lazy(() => import('@pages/ArticleSource'));
const Poll = React.lazy(() => import('@pages/Survey/Poll'));
const RcvArticle = React.lazy(() => import('@pages/RcvArticle'));
const Comment = React.lazy(() => import('@pages/CommentManage/Comment'));
const Boards = React.lazy(() => import('@pages/Boards'));
const Tour = React.lazy(() => import('@pages/Tour'));
const Article = React.lazy(() => import('@pages/Article'));
const Quiz = React.lazy(() => import('@pages/Survey/Quiz'));
const CommentBanned = React.lazy(() => import('@pages/CommentManage/Banned'));
const Mic = React.lazy(() => import('@pages/Mic'));
const SEOMeta = React.lazy(() => import('@pages/SEOMeta'));
const SearchKeyword = React.lazy(() => import('@pages/Search/SearchKeyword'));
const JpodChannel = React.lazy(() => import('@pages/Jpod/JpodChannel'));
const JpodEpisode = React.lazy(() => import('@pages/Jpod/JpodEpisode'));
const JpodNotice = React.lazy(() => import('@pages/Jpod/JpodNotice'));
const EditLog = React.lazy(() => import('@pages/EditLog'));
const SystemMonitor = React.lazy(() => import('@pages/SystemMonitor'));
const BulkMonitor = React.lazy(() => import('@pages/BulkMonitor'));
const InternalApi = React.lazy(() => import('@pages/InternalApi'));
const Package = React.lazy(() => import('@pages/Package'));
const Jopan = React.lazy(() => import('@pages/Jopan'));

const routes = [
    {
        path: '/desking',
        name: 'Desking',
        displayName: '페이지편집',
        component: Desking,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/',
        name: 'DashBoard',
        displayName: '대시보드',
        component: Dashboard,
        side: true,
        nonResponsive: true,
        exact: true,
    },
    {
        path: '/404',
        name: 'Page404',
        displayName: '404',
        component: () => <Page404 defaultLink="/" />,
    },
    {
        path: '/403',
        name: 'Page403',
        displayName: '403',
        component: () => <Page403 defaultLink="/" />,
    },
    {
        path: '/page',
        name: 'Page',
        displayName: '페이지관리',
        component: Page,
        side: true,
        nonResponsive: true,
        strict: true,
        exact: false,
    },
    {
        path: '/domain',
        name: 'Domain',
        displayName: '도메인관리',
        component: Domain,
        side: true,
        nonResponsive: true,
        exact: false,
    },
    {
        path: '/template',
        name: 'Template',
        displayName: '템플릿관리',
        component: Template,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/dataset',
        name: 'Dataset',
        displayName: '데이터셋관리',
        component: Dataset,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/container',
        name: 'Container',
        displayName: '컨테이너관리',
        component: Container,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/reserved',
        name: 'Reserved',
        displayName: '예약어관리',
        component: Reserved,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/component',
        name: 'Component',
        displayName: '컴포넌트관리',
        component: Component,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/code-mgt',
        name: 'CodeMgt',
        displayName: '기타코드관리',
        component: CodeMgt,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/edit-form',
        name: 'edit-form',
        displayName: 'Edit Form',
        component: EditForm,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/area',
        name: 'area',
        displayName: '편집영역관리',
        component: Area,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/menu',
        name: 'menu',
        displayName: '메뉴관리',
        component: Menu,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/group',
        name: 'group',
        displayName: '그룹관리',
        component: Group,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/reporter',
        name: 'reporter',
        displayName: '기자 관리',
        component: Reporter,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/special',
        name: 'Special',
        displayName: '디지털 스페셜 관리',
        component: Special,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/direct-link',
        name: 'direct-link',
        displayName: '사이트 바로 가기',
        component: DirectLink,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/member',
        name: 'member',
        displayName: '사용자 관리',
        component: Member,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/columnist',
        name: 'columnist',
        displayName: '칼럼니스트 관리',
        component: Columnist,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/sns-meta',
        name: 'sns-meta',
        displayName: 'FB & TW 관리',
        component: SnsMeta,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/fb-art',
        name: 'fb-art',
        displayName: 'FB전송기사 관리',
        component: FbArt,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/article-page',
        name: 'article-page',
        displayName: '아티클페이지 관리',
        component: ArticlePage,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkn-ja',
        name: 'bulkn-ja',
        displayName: '네이버 벌크 문구 관리',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkh-ja',
        name: 'bulkh-ja',
        displayName: '아티클 핫클릭',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkn-su',
        name: 'bulkn-su',
        displayName: '선데이 네이버 벌크 문구 관리',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkh-su',
        name: 'bulkh-su',
        displayName: '선데이 아티클 핫클릭',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article-sources',
        name: 'article-sources',
        displayName: '수신 매체 관리',
        component: ArticleSource,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/poll',
        name: 'poll',
        displayName: '투표 관리',
        component: Poll,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/quiz',
        name: 'quiz',
        displayName: '퀴즈 관리',
        component: Quiz,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/rcv-article',
        name: 'rcv-article',
        displayName: '수신 기사 전체',
        component: RcvArticle,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/comment',
        name: 'Comment',
        displayName: '댓글 목록',
        component: Comment,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/boarda-set',
        name: 'boarda-set',
        displayName: '전체 게시판 관리',
        component: Boards,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boards-set',
        name: 'boards-set',
        displayName: '전체 게시판 관리',
        component: Boards,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-month',
        name: '/tour-month',
        displayName: '월별 현황',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-list',
        name: '/tour-list',
        displayName: '신청 목록',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-set',
        name: 'tour-set',
        displayName: '기본 설정',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-message',
        name: 'tour-message',
        displayName: '메세지 설정',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article',
        name: 'article',
        displayName: '등록 기사 전체',
        component: Article,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/article-ja',
        name: 'articleJa',
        displayName: '등록 기사 - 중앙일보',
        component: Article,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/article-sun',
        name: 'articleSun',
        displayName: '등록 기사 - 중앙선데이',
        component: Article,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/boarda-list',
        name: 'boarda-list',
        displayName: '게시글 게시판 관리',
        component: Boards,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boards-list',
        name: 'boards-list',
        displayName: '게시글 게시판 관리',
        component: Boards,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-id',
        name: 'Banned-id',
        displayName: '차단ID 관리',
        component: CommentBanned,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-ip',
        name: 'Banned-ip',
        displayName: '차단IP 관리',
        component: CommentBanned,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-word',
        name: 'Banned-word',
        displayName: '금지어 관리',
        component: CommentBanned,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/mic',
        name: 'mic',
        displayName: '시민 마이크',
        component: Mic,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/seo-meta',
        name: 'seo-meta',
        displayName: 'SEO 메타관리',
        component: SEOMeta,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/cdn-article',
        name: 'cdnArticle',
        displayName: '트래픽 분산(기사) 관리',
        component: SystemMonitor,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/search-keyword',
        name: 'searchKeyword',
        displayName: '검색 로그',
        component: SearchKeyword,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-channel',
        name: 'jpod-channel',
        displayName: 'Jpod 채널관리',
        component: JpodChannel,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-episode',
        name: 'jpod-episode',
        displayName: 'Jpod 에피소드관리',
        component: JpodEpisode,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/edit-log',
        name: 'editLog',
        displayName: '로그 관리',
        component: EditLog,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulk-monitor-ja',
        name: 'bulk-monitor-ja',
        displayName: '벌크 모니터링',
        component: BulkMonitor,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/internal-api',
        name: 'internalApi',
        displayName: 'API 관리',
        component: InternalApi,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/schedule',
        name: 'schedule',
        displayName: '스케줄 서버 관리',
        component: SystemMonitor,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/package',
        name: 'package',
        displayName: '패키지 관리',
        component: Package,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-notice',
        name: 'jpod-notice',
        displayName: 'Jpod 공지 게시판 관리',
        component: JpodNotice,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/ja-jopan',
        name: 'ja-jopan',
        displayName: '중앙일보 조판',
        component: Jopan,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
    {
        path: '/sunday-jopan',
        name: 'sunday-jopan',
        displayName: '중앙선데이 조판',
        component: Jopan,
        side: true,
        nonResponsive: false,
        exact: false,
        strict: true,
    },
];

export default routes;
