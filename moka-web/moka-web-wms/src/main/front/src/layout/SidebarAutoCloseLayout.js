import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Wrapper from './components/Wrapper';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Content from './components/Content';
import NonResponsive from './components/NonResponsive';
import { openSidebar, closeSidebar } from '@store/layout/layoutAction';

let prevWidth = 0;

/**
 * window.innerWidth <= 1360px 일 때
 * 사이드바 자동 닫힘
 * window.innerWidth > 1360px 일 때
 * 사이드바 자동 열림
 *
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const SidebarAutoCloseLayout = ({ children, nonResponsive, ...rest }) => {
    const dispatch = useDispatch();

    /**
     * 화면 리사이즈시 sidebar open state를 변경한다
     */
    const resizeFunction = useCallback(() => {
        if (prevWidth > 1360 && window.innerWidth <= 1360) {
            dispatch(closeSidebar());
        } else if (prevWidth <= 1360 && window.innerWidth > 1360) {
            dispatch(openSidebar());
        }
        prevWidth = window.innerWidth;
    }, [dispatch]);

    useEffect(() => {
        if (window.innerWidth <= 1360) {
            dispatch(closeSidebar());
        }
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('resize', resizeFunction, false);
        return () => {
            window.removeEventListener('resize', resizeFunction, false);
        };
    }, [resizeFunction]);

    const layout = useCallback(
        () => (
            <>
                <Sidebar nonResponsive={nonResponsive} {...rest} />
                <Main>
                    <Navbar nonResponsive={nonResponsive} {...rest} />
                    <Content>{children}</Content>
                </Main>
            </>
        ),
        [children, nonResponsive, rest],
    );

    if (nonResponsive) {
        return <NonResponsive className="sac-layout">{layout()}</NonResponsive>;
    }

    return <Wrapper className="sac-layout">{layout()}</Wrapper>;
};

export default SidebarAutoCloseLayout;
