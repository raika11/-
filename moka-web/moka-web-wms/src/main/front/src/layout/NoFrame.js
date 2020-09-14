import React from 'react';
import Main from './component/Main';
import NonResponsive from './component/NonResponsive';

/**
 * NoFrame 레이아웃
 * @param {Element} param0.children children
 * @param {boolean} param0.nonResponsive 반응형 여부
 */
const NoFrame = ({ children, nonResponsive }) => {
    const main = () => <Main className="d-flex w-100 justify-content-center">{children}</Main>;

    if (nonResponsive) {
        return <NonResponsive>{main()}</NonResponsive>;
    }

    return main();
};

export default NoFrame;
