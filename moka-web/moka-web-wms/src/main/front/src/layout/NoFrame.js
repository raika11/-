import React from 'react';

import Wrapper from './components/Wrapper';
import Main from './components/Main';
import NonResponsive from './components/NonResponsive';

/**
 * NoFrame 레이아웃
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const NoFrame = ({ children, nonResponsive }) => {
    const layout = () => (
        <Wrapper>
            <Main className="d-flex w-100">{children}</Main>
        </Wrapper>
    );

    if (nonResponsive) {
        return <NonResponsive>{layout()}</NonResponsive>;
    }

    return layout();
};

export default NoFrame;
