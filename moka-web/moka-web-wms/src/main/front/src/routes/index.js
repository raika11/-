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
const Package = React.lazy(() => import('@pages/Issue'));
const Jopan = React.lazy(() => import('@pages/Jopan'));
const MyPage = React.lazy(() => import('@pages/MyPage'));
const AB = React.lazy(() => import('@pages/AB/AB'));
const ABAuto = React.lazy(() => import('@pages/AB/Auto')); // ????????????
const ABEdit = React.lazy(() => import('@pages/AB/Edit')); // ????????????
const ABJam = React.lazy(() => import('@pages/AB/Jam')); // JAM ??????
const ABResult = React.lazy(() => import('@pages/AB/Result')); // ????????? ??????
const NewsLetter = React.lazy(() => import('@pages/NewsLetterManage/NewsLetter'));
const NewsLetterCalendar = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterCalendar'));
const NewsLetterSend = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterSend'));
const NewsLetterSendArchive = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterSend/NewsLetterSendArchive'));
const NewsLetterResult = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterResult'));
const NewsLetterMResult = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterResult/NewsLetterMethodResult'));
const NewsLetterTResult = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterResult/NewsLetterTypeResult'));
const NewsLetterPResult = React.lazy(() => import('@pages/NewsLetterManage/NewsLetterResult/NewsLetterPeriodResult'));
const ArticlePackage = React.lazy(() => import('@pages/ArticlePackage'));
const SubscriptionDesign = React.lazy(() => import('@pages/Subscribe/Design'));

const routes = [
    {
        path: '/desking',
        name: 'Desking',
        displayName: '???????????????',
        component: Desking,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/',
        name: 'DashBoard',
        displayName: '????????????',
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
        path: '/mypage',
        name: 'mypage',
        displayName: '?????? ?????????',
        component: MyPage,
        side: true,

        exact: false,
        strict: true,
    },
    {
        path: '/page',
        name: 'Page',
        displayName: '???????????????',
        component: Page,
        side: true,
        nonResponsive: true,
        strict: true,
        exact: false,
    },
    {
        path: '/domain',
        name: 'Domain',
        displayName: '???????????????',
        component: Domain,
        side: true,
        nonResponsive: true,
        exact: false,
    },
    {
        path: '/template',
        name: 'Template',
        displayName: '???????????????',
        component: Template,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/dataset',
        name: 'Dataset',
        displayName: '??????????????????',
        component: Dataset,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/container',
        name: 'Container',
        displayName: '??????????????????',
        component: Container,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/reserved',
        name: 'Reserved',
        displayName: '???????????????',
        component: Reserved,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/component',
        name: 'Component',
        displayName: '??????????????????',
        component: Component,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/code-mgt',
        name: 'CodeMgt',
        displayName: '??????????????????',
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
        displayName: '??????????????????',
        component: Area,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/menu',
        name: 'menu',
        displayName: '????????????',
        component: Menu,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/group',
        name: 'group',
        displayName: '????????????',
        component: Group,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/reporter',
        name: 'reporter',
        displayName: '?????? ??????',
        component: Reporter,
        side: true,

        exact: false,
        strict: true,
    },
    {
        path: '/special',
        name: 'Special',
        displayName: '????????? ????????? ??????',
        component: Special,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/direct-link',
        name: 'direct-link',
        displayName: '????????? ?????? ??????',
        component: DirectLink,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/member',
        name: 'member',
        displayName: '????????? ??????',
        component: Member,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/columnist',
        name: 'columnist',
        displayName: '??????????????? ??????',
        component: Columnist,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/sns-meta',
        name: 'sns-meta',
        displayName: 'FB & TW ??????',
        component: SnsMeta,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/fb-art',
        name: 'fb-art',
        displayName: 'FB???????????? ??????',
        component: FbArt,
        side: true,

        exact: false,
        strict: true,
    },
    {
        path: '/article-page',
        name: 'article-page',
        displayName: '?????????????????? ??????',
        component: ArticlePage,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkn-ja',
        name: 'bulkn-ja',
        displayName: '????????? ?????? ?????? ??????',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkh-ja',
        name: 'bulkh-ja',
        displayName: '????????? ?????????',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkn-su',
        name: 'bulkn-su',
        displayName: '????????? ????????? ?????? ?????? ??????',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulkh-su',
        name: 'bulkh-su',
        displayName: '????????? ????????? ?????????',
        component: Bulks,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article-sources',
        name: 'article-sources',
        displayName: '?????? ?????? ??????',
        component: ArticleSource,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/poll',
        name: 'poll',
        displayName: '?????? ??????',
        component: Poll,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/quiz',
        name: 'quiz',
        displayName: '?????? ??????',
        component: Quiz,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/rcv-article',
        name: 'rcv-article',
        displayName: '?????? ?????? ??????',
        component: RcvArticle,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/comment',
        name: 'Comment',
        displayName: '?????? ??????',
        component: Comment,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boarda-set',
        name: 'boarda-set',
        displayName: '?????? ????????? ??????',
        component: Boards,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boards-set',
        name: 'boards-set',
        displayName: '?????? ????????? ??????',
        component: Boards,
        side: true,

        exact: false,
        strict: true,
    },
    {
        path: '/tour-month',
        name: '/tour-month',
        displayName: '?????? ??????',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-list',
        name: '/tour-list',
        displayName: '?????? ??????',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-set',
        name: 'tour-set',
        displayName: '?????? ??????',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/tour-message',
        name: 'tour-message',
        displayName: '????????? ??????',
        component: Tour,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article',
        name: 'article',
        displayName: '?????? ?????? ??????',
        component: Article,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article-ja',
        name: 'articleJa',
        displayName: '?????? ?????? - ????????????',
        component: Article,
        side: true,

        exact: false,
        strict: true,
    },
    {
        path: '/article-sun',
        name: 'articleSun',
        displayName: '?????? ?????? - ???????????????',
        component: Article,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boarda-list',
        name: 'boarda-list',
        displayName: '????????? ????????? ??????',
        component: Boards,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/boards-list',
        name: 'boards-list',
        displayName: '????????? ????????? ??????',
        component: Boards,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-id',
        name: 'Banned-id',
        displayName: '??????ID ??????',
        component: CommentBanned,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-ip',
        name: 'Banned-ip',
        displayName: '??????IP ??????',
        component: CommentBanned,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/banned-word',
        name: 'Banned-word',
        displayName: '????????? ??????',
        component: CommentBanned,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/mic',
        name: 'mic',
        displayName: '?????? ?????????',
        component: Mic,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/seo-meta',
        name: 'seo-meta',
        displayName: 'SEO ????????????',
        component: SEOMeta,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/cdn-article',
        name: 'cdnArticle',
        displayName: '????????? ??????(??????) ??????',
        component: SystemMonitor,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/search-keyword',
        name: 'searchKeyword',
        displayName: '?????? ??????',
        component: SearchKeyword,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-channel',
        name: 'jpod-channel',
        displayName: 'Jpod ????????????',
        component: JpodChannel,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-episode',
        name: 'jpod-episode',
        displayName: 'Jpod ??????????????????',
        component: JpodEpisode,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/edit-log',
        name: 'editLog',
        displayName: '?????? ??????',
        component: EditLog,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/bulk-monitor-ja',
        name: 'bulk-monitor-ja',
        displayName: '?????? ????????????',
        component: BulkMonitor,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/internal-api',
        name: 'internalApi',
        displayName: 'API ??????',
        component: InternalApi,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/schedule',
        name: 'schedule',
        displayName: '????????? ?????? ??????',
        component: SystemMonitor,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/issue',
        name: 'issue',
        displayName: '????????? ??????',
        component: Package,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/jpod-notice',
        name: 'jpod-notice',
        displayName: 'Jpod ?????? ????????? ??????',
        component: JpodNotice,
        exact: false,
        strict: true,
    },
    {
        path: '/ja-jopan',
        name: 'ja-jopan',
        displayName: '???????????? ??????',
        component: Jopan,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/sunday-jopan',
        name: 'sunday-jopan',
        displayName: '??????????????? ??????',
        component: Jopan,
        side: true,
        exact: false,
        strict: true,
    },
    {
        path: '/ab',
        name: 'ab',
        component: AB,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/ab-auto',
        name: 'abAuto',
        component: ABAuto,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/ab-edit',
        name: 'abEdit',
        component: ABEdit,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/ab-jam',
        name: 'abJam',
        component: ABJam,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/ab-result',
        name: 'abResult',
        component: ABResult,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter',
        name: 'newsLetter',
        displayName: '???????????? ?????? ??????',
        component: NewsLetter,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-calendar',
        name: 'newsLetterCalendar',
        displayName: '???????????? ?????? ??????',
        component: NewsLetterCalendar,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-send',
        name: 'newsLetterSend',
        displayName: '???????????? ?????? ??????',
        component: NewsLetterSend,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-senda',
        name: 'NewsLetterSendArchive',
        displayName: '???????????? ???????????? ??????',
        component: NewsLetterSendArchive,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-result',
        name: 'newsLetterResult',
        displayName: '???????????? ?????? ?????? ??????',
        component: NewsLetterResult,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-mresult',
        name: 'newsLetterMResult',
        displayName: '???????????? ?????? ????????? ??????',
        component: NewsLetterMResult,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-tresult',
        name: 'newsLetterTResult',
        displayName: '???????????? ????????? ??????',
        component: NewsLetterTResult,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/news-letter-presult',
        name: 'newsLetterPResult',
        displayName: '???????????? ?????? ?????????(??????) ??????',
        component: NewsLetterPResult,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/article-package',
        name: 'articlePackage',
        displayName: '?????? ?????????',
        component: ArticlePackage,
        side: true,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
    {
        path: '/subscription-design',
        name: 'subscriptionDesigh',
        component: SubscriptionDesign,
        side: false,
        nonResponsive: true,
        exact: false,
        strict: true,
    },
];

export default routes;
