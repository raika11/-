import React from 'react';
import { MokaModal } from '@components';

/**
 * 기사 미리보기 모달
 */
const ArticlePreviewModal = (props) => {
    const { show, onHide, article } = props;

    return (
        <MokaModal title="기사보기" show={show} onHide={onHide} id={article?.totalId} size="lg" width={700} draggable centered>
            <p className="h3">워커힐 호텔앤리조트, 중식당 '금룡' 리뉴얼 오픈</p>
            <p>
                <span className="text-info mr-1">[웨딩21]</span>
                입력 2020-11-30 11:00:00 / 수정 2020-11-30 11:05:00
            </p>
            <div className="custom-scroll" style={{ height: 500 }}>
                본문노출
            </div>
        </MokaModal>
    );
};

export default ArticlePreviewModal;
