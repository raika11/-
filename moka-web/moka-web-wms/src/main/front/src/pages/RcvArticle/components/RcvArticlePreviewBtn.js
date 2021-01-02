import React, { forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';
import { popupPreview } from '@utils/commonUtil';
import { API_BASE_URL } from '@/constants';

const RcvArticlePreviewBtn = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = () => {
        popupPreview(`${API_BASE_URL}/preview/rcv-article/${data.rid}`, { ...data, servicePlatform: 'P' });
    };

    return (
        <React.Fragment>
            <Button variant={data.compUrl ? 'table-btn' : 'outline-table-btn'} size="sm" onClick={handleClickPreviewOpen}>
                {data.compUrl ? '포토' : '보기'}
            </Button>
        </React.Fragment>
    );
});

export default RcvArticlePreviewBtn;
