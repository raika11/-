import React from 'react';

import Wrapper from './components/Wrapper';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Content from './components/Content';
import NonResponsive from './components/NonResponsive';

/**
 * 사이드바가 열려있는 레이아웃(기본 레이아웃)
 * 화면 축소 시 사이드바가 자동으로 닫히지 않음
 *
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const DefaultLayout = ({ children, nonResponsive }) => {
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
        return <NonResponsive className="so-layout">{layout()}</NonResponsive>;
    }

    return <Wrapper className="so-layout">{layout()}</Wrapper>;
};

export default DefaultLayout;
