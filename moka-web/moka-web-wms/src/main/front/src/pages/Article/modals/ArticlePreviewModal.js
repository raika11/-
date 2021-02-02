import React from 'react';
import { MokaModal } from '@components';
import { unescapeHtmlArticle } from '@utils/convertUtil';

/**
 * 기사 미리보기 모달
 */
const ArticlePreviewModal = (props) => {
    const { show, onHide, article = {} } = props;

    return (
        <MokaModal title="기사보기" show={show} onHide={onHide} id={String(article?.totalId)} size="lg" width={700} draggable centered>
            <p className="h3">{unescapeHtmlArticle(article.title)}</p>
            <p>
                <span className="text-info mr-1">[{article.articleSource?.sourceName}]</span>
                입력 {article.regDt}
                {/*  / 수정 2020-11-30 11:05:00 */}
            </p>
            <div className="flex-fill custom-scroll border rounded p-2" style={{ height: 500 }} dangerouslySetInnerHTML={{ __html: article.content }} />
        </MokaModal>
    );
};

export default ArticlePreviewModal;
