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

/**
 * 기본 레이아웃(기본 레이아웃)
 * 라우트 페이지에서 사이드바를 닫고 싶으면 요청
 *
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const DefaultLayout = ({ children, ...rest }) => {
    const dispatch = useDispatch();
    const { latestMenuId, currentMenu, nonResponsive, side } = useSelector((store) => ({
        latestMenuId: store.auth.latestMenuId,
        currentMenu: store.auth.currentMenu,
        nonResponsive: store.auth.nonResponsive,
        side: store.auth.side,
    }));

    useEffect(() => {
        if (side) {
            dispatch(openSidebar());
        } else {
            dispatch(closeSidebar());
        }
    }, [dispatch, latestMenuId, nonResponsive, side, currentMenu]);

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
