import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Button from 'react-bootstrap/Button';
import utils from '@utils/commonUtil';
import { API_BASE_URL, PREVIEW_DOMAIN_ID } from '@/constants';
import { MokaModal } from '@components';
import ArticleTableCopyBtn from './ArticleTableCopyBtn';

const ArticleViewBtn = forwardRef(({ data }, ref) => {
    const [previewOn, setPreviewOn] = useState(false);

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = () => {
        utils.popupPreview(`${API_BASE_URL}/preview/article/${data.totalId}`, { ...data, domainId: PREVIEW_DOMAIN_ID });
    };

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    return (
        <div className="d-flex align-items-center h-100">
            {/* 포토/보기 */}
            <Button
                variant={data.artThumb && data.artThumb !== '' ? 'table-btn' : 'outline-table-btn'}
                className="mr-1 px-1 flex-shrink-0"
                size="sm"
                onClick={handleClickPreviewOpen}
            >
                {data.artThumb && data.artThumb !== '' ? '포토' : '보기'}
            </Button>

            {/* 편집그룹 */}
            {data.ja && data.artGroupNum !== '' && (
                <div className="article-group-number mr-1" style={{ width: 17, height: 24 }} data-group-number={data.artGroupNum}>
                    {data.artGroupNum}
                </div>
            )}

            {/* copy */}
            <ArticleTableCopyBtn className="mr-1" artTitle={data.artTitle} artUrl={data.artUrl} />

            {/* jtbcvod */}
            {data.jtbcvodYn === 'Y' && (
                <Button size="sm" variant="outline-table-btn px-1" onClick={() => setPreviewOn(true)} className="flex-shrink-0">
                    B
                </Button>
            )}

            {/* ovp 미리보기 */}
            <MokaModal show={previewOn} onHide={() => setPreviewOn(false)} width={500} size="md" title="영상보기" centered>
                <iframe src={data.vodFullLink} title="미리보기" frameBorder="0" className="w-100" style={{ height: 300 }} />
            </MokaModal>
        </div>
    );
});

export default ArticleViewBtn;
