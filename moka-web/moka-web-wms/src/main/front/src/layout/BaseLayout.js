import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Wrapper from './components/Wrapper';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Content from './components/Content';
import NonResponsive from './components/NonResponsive';
import { closeSidebar, openSidebar } from '@store/layout';
import Routes from '../routes/Routes';
import useBreakpoint from '@/hooks/useBreakpoint';

/**
 * 기본 레이아웃(기본 레이아웃)
 * 라우트 페이지에서 사이드바를 닫고 싶으면 요청
 *
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const DefaultLayout = ({ children, ...rest }) => {
    const dispatch = useDispatch();
    const { currentMenu, nonResponsive, side } = useSelector((store) => ({
        currentMenu: store.auth.currentMenu,
        nonResponsive: store.auth.nonResponsive,
        side: store.auth.side,
    }));

    // 현재 브라우저 내부 사이즈 상태를 얻어옴
    const matchPoints = useBreakpoint();

    const resizeFunction = useCallback(() => {
        if (!nonResponsive) {
            // md의 최소width보다 작을 경우 메뉴가 닫힌다.
            if (matchPoints.sm || matchPoints.xs) {
                dispatch(closeSidebar());
            } else {
                dispatch(openSidebar());
            }
        }
    }, [dispatch, nonResponsive, matchPoints]);

    useEffect(() => {
        if (side) {
            dispatch(openSidebar());
        } else {
            dispatch(closeSidebar());
        }
        /**
         * 페이지 resize시에만 메뉴 자동 닫힘 호출
         * 닫힌 상태에서 메뉴를 이동하여 화면 이동시에는 메뉴가 닫히지 않도록 함
         * - 사유 : 메뉴 열어놓고 화면 이동하는데 계속 닫히면 엄청 짜증남
         */
        window.addEventListener('resize', resizeFunction);
        window.addEventListener('load', resizeFunction);

        // Specify how to clean up after this effect:
        return () => {
            window.removeEventListener('resize', resizeFunction);
            window.removeEventListener('load', resizeFunction);
        };
    }, [dispatch, resizeFunction, nonResponsive, side, matchPoints]);

    const layout = useCallback(
        () => (
            <React.Fragment>
                <Sidebar nonResponsive={nonResponsive} currentMenu={currentMenu} {...rest} />
                <Main>
                    <Navbar nonResponsive={nonResponsive} currentMenu={currentMenu} {...rest} />
                    <Content>
                        <Routes />
                    </Content>
                </Main>
            </React.Fragment>
        ),
        [currentMenu, nonResponsive, rest],
    );

    if (nonResponsive) {
        return <NonResponsive className="so-layout">{layout()}</NonResponsive>;
    }

    return <Wrapper className="so-layout">{layout()}</Wrapper>;
};

export default DefaultLayout;
