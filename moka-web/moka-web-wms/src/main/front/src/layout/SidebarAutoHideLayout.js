import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Wrapper from './components/Wrapper';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Content from './components/Content';
import NonResponsive from './components/NonResponsive';
import { showSidebar, hideSidebar } from '@store/layout/layoutAction';

let prevWidth = 0;

/**
 * 1360px일때 사이드바 숨김
 *
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const SidebarAutoHideLayout = ({ children, nonResponsive }) => {
    const dispatch = useDispatch();

    /**
     * 화면 리사이즈시 sidebar open state를 변경한다
     */
    const resizeFunction = useCallback(() => {
        if (prevWidth > 1360 && window.innerWidth <= 1360) {
            dispatch(hideSidebar());
        } else if (prevWidth <= 1360 && window.innerWidth > 1360) {
            dispatch(showSidebar());
        }
        prevWidth = window.innerWidth;
    }, [dispatch]);

    useEffect(() => {
        if (window.innerWidth <= 1360) {
            dispatch(hideSidebar());
        }
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('resize', resizeFunction, false);
        return () => {
            window.removeEventListener('resize', resizeFunction, false);
        };
    }, [resizeFunction]);

    const layout = () => (
        <>
            <Sidebar nonResponsive={nonResponsive} />
            <Main>
                <Navbar nonResponsive={nonResponsive} />
                <Content>{children}</Content>
            </Main>
        </>
    );

    if (nonResponsive) {
        return <NonResponsive className="default-layout">{layout()}</NonResponsive>;
    }

    return <Wrapper className="s-auto-hide-layout">{layout()}</Wrapper>;
};

export default SidebarAutoHideLayout;
