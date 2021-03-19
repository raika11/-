import React from 'react';
import Button from 'react-bootstrap/Button';

/**
 * chunks 로드 실패 fallback
 */
const MokaErrorFallback = () => {
    return (
        <div className="vw-100 vh-100 d-flex flex-column align-items-center justify-content-center" style={{ opacity: '70%' }}>
            <h1>파일이 변경되어 페이지를 로드하지 못했습니다</h1>
            <Button size="lg" variant="negative" onClick={() => window.location.reload()}>
                새로고침 하기
            </Button>
        </div>
    );
};

export default MokaErrorFallback;
