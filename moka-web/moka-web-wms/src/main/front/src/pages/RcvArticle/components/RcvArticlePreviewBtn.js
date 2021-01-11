import React, { forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import { API_BASE_URL } from '@/constants';
import { messageBox } from '@utils/toastUtil';

const RcvArticlePreviewBtn = forwardRef(({ data }, ref) => {
    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = () => {
        if (data.totalId && data.totalId !== 0) {
            commonUtil.popupPreview(`${API_BASE_URL}/preview/rcv-article/${data.rid}`, { ...data, servicePlatform: 'P' });
        } else {
            messageBox.alert('등록되지 않은 기사입니다', () => {});
        }
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
