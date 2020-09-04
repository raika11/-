import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import produce from 'immer';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import WifiIcon from '@material-ui/icons/Wifi';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import PhotoIcon from '@material-ui/icons/Photo';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { WmsBreadcrumb, WmsIconButton, WmsSelect, WmsDialogAlert } from '~/components';
import routes from '~/routes';
import { changeLatestMediaId, logout } from '~/stores/auth/authStore';
import { clearPage } from '~/stores/page/pageStore';
import { clearContainer } from '~/stores/container/containerStore';
import style from '~/assets/jss/components/WmsRoute/TopbarStyle';

/**
 * Topbar Style
 */
const useStyle = makeStyles(style);
const defaultCreate = [
    { id: 'notice', name: '공지사항을 알려드립니다.' },
    { id: 'promise', name: 'WMS 전체 시스템 점검 안내' },
    { id: 'Y', name: 'Wms 버그 / 기타 오류 문의는 1234 - 5678' }
];

/**
 * Topbar
 * @param {object} props
 */
const Topbar = (props) => {
    const classes = useStyle();
    const { resized, sidebarMini, sidebarMinimalize, column, disableMedia } = props;
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const { menu, medias, loading, latestMediaId } = useSelector((store) => ({
        menu: store.authStore.menu,
        medias: store.authStore.medias,
        loading: store.loadingStore['authStore/GET_MEDIAS'],
        latestMediaId: store.authStore.latestMediaId
    }));
    const [navi, setNavi] = useState([]);
    const [mediaRows, setMediaRows] = useState([]);
    const [open, setOpen] = useState(false);

    /**
     * 부모노드 찾기(재귀함수)
     */
    const findNode = useCallback((findInfo, rootNode) => {
        const rootValue = String(rootNode[findInfo.findKey], '');
        if (findInfo.findValue === rootValue) {
            return produce(findInfo, (draft) => draft);
        }

        if (rootNode.nodes && rootNode.nodes.length > 0) {
            for (let i = 0; i < rootNode.nodes.length; i++) {
                const newInfo = produce(findInfo, (draft) => {
                    draft.node = rootNode.nodes[i];
                    draft.path.push({
                        menuPath: rootNode.nodes[i].menuPath,
                        menuDispName: rootNode.nodes[i].menuDispName
                    });
                });
                const fnode = findNode(newInfo, rootNode.nodes[i]);
                if (fnode !== null && fnode.node !== null) {
                    return fnode;
                }
            }
            return null;
        }
        return null;
    }, []);

    useEffect(() => {
        /**
         * 첫 로딩시, 메뉴트리정보 세팅
         * 현재 url에서 일치하는 route.path 검색
         */
        let findUrl = location.pathname;
        const matchRoutes = routes.filter((r) => findUrl.startsWith(r.path));
        if (matchRoutes) {
            let almostRoute = matchRoutes.reduce((prev, current) =>
                prev.path.length > current.path.length ? prev : current
            );
            findUrl = almostRoute.path;
        }

        // 메뉴트리에서 현재 메뉴의 부모노드들을 배열로 조회
        if (menu.nodes && menu.nodes.length > 0) {
            let findInfo = {
                findKey: 'menuPath',
                findValue: findUrl,
                node: null,
                path: []
            };
            let fnode = findNode(findInfo, menu);
            if (fnode) {
                // 현재노드 선택
                setNavi(fnode.path);
            }
        }
    }, [menu, findNode, location]);

    useEffect(() => {
        /** mediaRows 생성 */
        if (!loading && medias) {
            setMediaRows(
                medias.map((m) => ({
                    id: m.mediaId,
                    name: m.mediaName
                }))
            );
        }
    }, [loading, medias]);

    /** 매체변경. authStore의 마지막 매체정보 변경 */
    const handleMediaChange = useCallback(
        (e) => {
            dispatch(changeLatestMediaId({ mediaId: e.target.value }));

            // 현재 url에서 일치하는 route.path검색
            let findUrl = location.pathname;
            const matchRoutes = routes.filter((r) => findUrl.startsWith(r.path));
            if (matchRoutes) {
                let almostRoute = matchRoutes.reduce((prev, current) =>
                    prev.path.length > current.path.length ? prev : current
                );
                findUrl = almostRoute.path;
            }

            // 매체 변경 시 업무 기본 url로 변경. 매체종속이 아닌 경우는 제외
            if (findUrl !== '/dataset') {
                history.push(findUrl);
            }

            // store clear
            if (findUrl === '/page') {
                dispatch(clearPage());
            }
            if (findUrl === '/container') {
                dispatch(clearContainer());
            }
        },
        [dispatch, location, history]
    );

    /** @media (min-width:1280px) 체크 */
    const isUpSm = useMediaQuery(theme.breakpoints.up('sm'), {
        defaultMatches: true
    });

    /** 메뉴 접기 버튼 생성 */
    const MenuBtn = () => {
        if (column === 'ColumnTwoOverlay') {
            if (isUpSm) {
                return (
                    <WmsIconButton onClick={sidebarMinimalize} color="white">
                        {sidebarMini ? <MenuIcon /> : <MenuOpenIcon />}
                    </WmsIconButton>
                );
            }
            return undefined;
        }
        return (
            <WmsIconButton onClick={sidebarMinimalize} color="white">
                {sidebarMini ? <MenuIcon /> : <MenuOpenIcon />}
            </WmsIconButton>
        );
    };

    /** 로그아웃 */
    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className={classes.head}>
            <div className={classes.logoSphere}>
                <div className={classes.logo}>MCP - WMS</div>
            </div>
            <div className={classes.topbarContent}>
                {/* 왼쪽 컨텐츠 */}
                <div className={classes.leftContent}>
                    {resized && MenuBtn()}
                    <div className={classes.mr8}>
                        <WmsSelect
                            color="white"
                            rows={mediaRows}
                            currentId={latestMediaId}
                            onChange={handleMediaChange}
                            disabled={disableMedia}
                        />
                    </div>
                    <WmsBreadcrumb separator={<NavigateNextIcon fontSize="small" />} color="white">
                        {navi.map((n, idx) => {
                            if (idx === navi.length - 1) {
                                return (
                                    <Typography color="textPrimary" key={idx}>
                                        {n.menuDispName}
                                    </Typography>
                                );
                            }
                            return (
                                <Link href={n.menuPath} key={idx}>
                                    {n.menuDispName}
                                </Link>
                            );
                        })}
                    </WmsBreadcrumb>
                </div>
                {/* 오른쪽 컨텐츠 */}
                <div className={classes.rightContent}>
                    {/* 공지 */}
                    <div className={classes.notice}>
                        <WmsSelect
                            color="white"
                            rows={defaultCreate}
                            currentId={latestMediaId}
                            onChange={handleMediaChange}
                            disabled={disableMedia}
                            width={330}
                        />
                    </div>
                    <WmsIconButton color="white">
                        <WifiIcon />
                    </WmsIconButton>
                    <WmsIconButton color="white" notification="true">
                        <AllInboxIcon />
                    </WmsIconButton>
                    <WmsIconButton color="white" notification="true">
                        <NotificationsIcon />
                    </WmsIconButton>
                    {/* 프로필 */}
                    <div className={classes.profile}>
                        <div className={classes.profileImg}>
                            <PhotoIcon />
                        </div>
                        <Typography
                            component="span"
                            variant="body1"
                            className={classes.profileName}
                        >
                            주서울
                        </Typography>
                    </div>
                    {/* 로그아웃버튼 */}
                    <WmsIconButton
                        overrideClassName={classes.logout}
                        color="white"
                        onClick={() => setOpen(true)}
                        title="로그아웃"
                    >
                        <ExitToAppIcon />
                    </WmsIconButton>
                    <WmsDialogAlert
                        title="로그아웃"
                        open={open}
                        type="confirm"
                        onClose={() => setOpen(false)}
                        okCallback={handleLogout}
                    >
                        <Typography component="div" variant="h5">
                            로그아웃 하시겠습니까?
                        </Typography>
                    </WmsDialogAlert>
                </div>
            </div>
        </div>
    );
};

Topbar.propTypes = {
    resized: PropTypes.bool.isRequired,
    sidebarMinimalize: PropTypes.func.isRequired,
    sidebarMini: PropTypes.bool.isRequired,
    disableMedia: PropTypes.bool.isRequired,
    column: PropTypes.string
};

Topbar.defaultProps = {
    column: undefined
};

export default Topbar;
