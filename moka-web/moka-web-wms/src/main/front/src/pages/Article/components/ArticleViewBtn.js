import React, { forwardRef, useImperativeHandle, useState } from 'react';
import copy from 'copy-to-clipboard';
import Button from 'react-bootstrap/Button';
import { popupPreview } from '@utils/commonUtil';
import toast from '@utils/toastUtil';
import { API_BASE_URL } from '@/constants';
import { useClickPreventionOnDoubleClick, MokaModal } from '@components';

const ArticleViewBtn = forwardRef(({ data }, ref) => {
    const [previewOn, setPreviewOn] = useState(false);

    useImperativeHandle(ref, () => ({
        refresh: () => {
            setPreviewOn(false);
            return false;
        },
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
        popupPreview(`${API_BASE_URL}/preview/article/${data.totalId}`, { ...data, servicePlatform: 'P' });
    };

    return (
        <div className="d-flex align-items-center h-100">
            <Button variant={data.compUrl ? 'table-btn' : 'outline-table-btn'} className="mr-1 flex-shrink-0" size="sm" onClick={handleClickPreviewOpen}>
                {data.compUrl ? '포토' : '보기'}
            </Button>
            {data.ja && (
                <div className="article-group-number mr-1" style={{ width: 24, height: 24 }} data-group-number={data.artGroupNum || (data.totalId % 8) + 1}>
                    {data.artGroupNum || (data.totalId % 8) + 1}
                </div>
            )}
            <Button size="sm" variant="outline-table-btn" className="mr-1 flex-shrink-0" onClick={handleClickCopy} onDoubleClick={handleDoubleClickCopy}>
                C
            </Button>
            {/* // {data.ovpYn === 'Y' && ( */}
            {String(data.totalId) === '23854886' && (
                <Button size="sm" variant="outline-table-btn" onClick={() => setPreviewOn(true)} className="flex-shrink-0">
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
