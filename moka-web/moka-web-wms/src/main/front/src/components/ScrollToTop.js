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
        // 파일 드롭 제한
        window.addEventListener(
            'dragover',
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!e.target.classList.contains('is-file-dropzone')) {
                    e.dataTransfer.effectAllowed = 'none';
                    e.dataTransfer.dropEffect = 'none';
                }
            },
            false,
        );
        window.addEventListener(
            'drop',
            (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!e.target.classList.contains('is-file-dropzone')) {
                    e.dataTransfer.effectAllowed = 'none';
                    e.dataTransfer.dropEffect = 'none';
                }
            },
            false,
        );
    }, [location]);

    return children;
};

export default ScrollToTop;
