import React from 'react';

import Wrapper from './component/Wrapper';
import Sidebar from './component/Sidebar';
import Main from './component/Main';
import Navbar from './component/Navbar';
import Content from './component/Content';
import NonResponsive from './component/NonResponsive';

/**
 * 기본 레이아웃 (Sidebar, Main)
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
        return <NonResponsive>{layout()}</NonResponsive>;
    }

    return <Wrapper>{layout()}</Wrapper>;
};

export default DefaultLayout;
