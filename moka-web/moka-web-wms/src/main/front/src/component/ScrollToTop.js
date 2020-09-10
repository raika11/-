import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * history 변경 시 스크롤 탑으로 이동
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
