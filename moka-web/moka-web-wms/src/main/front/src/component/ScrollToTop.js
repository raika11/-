import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * browser history 변경 시 스크롤 0으로 설정
 * @param {Element} param0.children children
 */
const ScrollToTop = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return children;
};

export default ScrollToTop;
