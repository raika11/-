import React, { Suspense, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Redirect, Route as RouteDom } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { getMenu, getMedias } from '~/stores/auth/authStore';
import routes from '~/routes';
import Notifier from './Notifier';
import MainLoader, { TopbarLoader, SidebarLoader } from './Loader';
import style from '~/assets/jss/components/WmsRoute/WmsRouteStyle';

/**
 * Router Style
 */
const useStyles = makeStyles(style);
const Topbar = React.lazy(() => import('./Topbar'));
const Sidebar = React.lazy(() => import('./Sidebar'));

/**
 * wms 라우트 생성 컴포넌트
 */
const WmsRoute = () => {
    const dispatch = useDispatch();
    const [classes, setClasses] = useState(useStyles());
    const [column, setColumn] = useState('');

    // Topbar State
    const [menuOn, setMenuOn] = useState(false); // 사이드바 접기 버튼 토글
    const [resized, setResized] = useState(true); // 사이드바 접기 버튼 show/hide
    const [disableMedia, setDisabledMedia] = useState(false); // 탑바의 컨텐츠 이용가능/불가능

    // Sidebar State
    const [toggleOpen, setToggleOpen] = useState(false); // 마우스오버 or 사이드바 확장 상태
    const [sidebarMini, setSidebarMini] = useState(false); // 사이드바 접은 상태
    const [fixed, setFixed] = useState(false); // 사이드바 못접게 고정한 상태인지

    /**
     * 사이드바 미니멀라이즈
     */
    const sidebarMinimalize = () => {
        setSidebarMini(!sidebarMini);
        setToggleOpen(false);
    };
    /**
     * 메뉴 클릭 함수
     */
    const menuClick = () => {
        setMenuOn(!menuOn);
    };

    /**
     * 개인 메뉴, 미디어를 조회한다
     */
    useEffect(() => {
        dispatch(getMenu());
        dispatch(getMedias());
    }, [dispatch]);

    // 컴포넌트에 전달할 props
    const layoutProps = {
        column,
        setColumn,
        resized,
        setResized,
        fixed,
        setFixed,
        disableMedia,
        setDisabledMedia,
        sidebarMini,
        setSidebarMini,
        classes,
        setClasses,
        toggleOpen,
        setToggleOpen
    };

    return (
        <div className={classes.wrapper}>
            <Notifier />
            {/* 헤더의 탑바 */}
            <div className={classes.topbar}>
                <Suspense fallback={<TopbarLoader />}>
                    <Topbar
                        resized={resized}
                        disableMedia={disableMedia}
                        sidebarMinimalize={sidebarMinimalize}
                        sidebarMini={sidebarMini}
                        column={column}
                    />
                </Suspense>
            </div>
            {/* 사이드바 */}
            <div className={classes.sidebar}>
                <Suspense fallback={<SidebarLoader />}>
                    <Sidebar
                        fixed={fixed}
                        sidebarMinimalize={sidebarMinimalize}
                        sidebarMini={sidebarMini}
                        toggleOpen={toggleOpen}
                        setToggleOpen={setToggleOpen}
                        menuClick={menuClick}
                        menuOn={menuOn}
                        column={column}
                    />
                </Suspense>
            </div>
            {/* 메인 */}
            <div className={clsx(classes.container, { [classes.containerOn]: sidebarMini })}>
                <Suspense fallback={<MainLoader />}>
                    <Switch>
                        {routes &&
                            routes.map((route) => {
                                return route.component ? (
                                    <RouteDom
                                        key={`${route.path}/${route.displayName}`}
                                        exact={route.exact}
                                        strict={route.strict}
                                        path={route.path}
                                        name={route.displayName}
                                        render={(staticContext, ...matchProps) => (
                                            <route.component {...layoutProps} {...matchProps} />
                                        )}
                                    />
                                ) : null;
                            })}
                        <Redirect to="/desking" />
                    </Switch>
                </Suspense>
            </div>
        </div>
    );
};

export default WmsRoute;
