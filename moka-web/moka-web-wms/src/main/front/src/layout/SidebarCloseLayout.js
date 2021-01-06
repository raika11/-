import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Wrapper from './components/Wrapper';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Content from './components/Content';
import NonResponsive from './components/NonResponsive';
import { closeSidebar } from '@store/layout/layoutAction';

/**
 * 사이드바가 닫혀있는 레이아웃
 * 화면 축소 시 사이드바가 자동으로 열리지 않음
 *
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const SidebarCloseLayout = ({ children, nonResponsive, ...rest }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(function () {
            dispatch(closeSidebar());
        }, 500);
    }, [dispatch]);

    const layout = useCallback(
        () => (
            <React.Fragment>
                <Sidebar nonResponsive={nonResponsive} {...rest} />
                <Main>
                    <Navbar nonResponsive={nonResponsive} {...rest} />
                    <Content>{children}</Content>
                </Main>
            </React.Fragment>
        ),
        [children, nonResponsive, rest],
    );

    if (nonResponsive) {
        return <NonResponsive className="sc-layout">{layout()}</NonResponsive>;
    }

    return <Wrapper className="sc-layout">{layout()}</Wrapper>;
};

export default SidebarCloseLayout;
