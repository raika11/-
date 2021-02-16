import React, { forwardRef, useImperativeHandle, useState } from 'react';
import copy from 'copy-to-clipboard';
import Button from 'react-bootstrap/Button';
import utils from '@utils/commonUtil';
import toast from '@utils/toastUtil';
import { API_BASE_URL, PREVIEW_DOMAIN_ID } from '@/constants';
import { MokaModal } from '@components';
import useClickPreventionOnDoubleClick from '@hooks/useClickPreventionOnDoubleClick';

const ArticleViewBtn = forwardRef(({ data }, ref) => {
    const [previewOn, setPreviewOn] = useState(false);

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    /**
     * 복사
     */
    const [handleClickCopy, handleDoubleClickCopy] = useClickPreventionOnDoubleClick(
        () => {
            copy(data.artUrl);
            toast.success('기사 링크를 복사하였습니다');
        },
        () => {
            copy(`${data.artTitle}\n${data.artUrl}`);
            toast.success('제목과 기사 링크를 복사하였습니다');
        },
    );

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = () => {
        utils.popupPreview(`${API_BASE_URL}/preview/article/${data.totalId}`, { ...data, domainId: PREVIEW_DOMAIN_ID });
    };

    return (
        <div className="d-flex align-items-center h-100">
            <Button
                variant={data.artThumb && data.artThumb !== '' ? 'table-btn' : 'outline-table-btn'}
                className="mr-1 px-1 flex-shrink-0"
                size="sm"
                onClick={handleClickPreviewOpen}
            >
                {data.artThumb && data.artThumb !== '' ? '포토' : '보기'}
            </Button>
            {data.ja && data.artGroupNum !== '' && (
                <div className="article-group-number mr-1" style={{ width: 17, height: 24 }} data-group-number={data.artGroupNum}>
                    {data.artGroupNum}
                </div>
            )}
            <Button size="sm" variant="outline-table-btn" className="mr-1 flex-shrink-0 px-1" onClick={handleClickCopy} onDoubleClick={handleDoubleClickCopy}>
                C
            </Button>
            {data.ovpYn === 'Y' && (
                <Button size="sm" variant="outline-table-btn px-1" onClick={() => setPreviewOn(true)} className="flex-shrink-0">
                    B
                </Button>
            )}

            {/* ovp 미리보기 */}
            <MokaModal show={previewOn} onHide={() => setPreviewOn(false)} width={500} size="md" title="영상보기" centered>
                <iframe src={data.ovpFullLink} title="미리보기" frameBorder="0" className="w-100" style={{ height: 300 }} />
            </MokaModal>
        </div>
    );
});

export default ArticleViewBtn;
