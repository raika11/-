import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showPreviewModal, getModalBulkArticle } from '@store/bulks';
import { messageBox } from '@utils/toastUtil';

// grid 미리보기 버튼 렌더.
const PreviewRenderer = ({ bulkartSeq }) => {
    const dispatch = useDispatch();

    // 미리 보기 버튼 상태 변경.
    const handleClickPreviewButton = () => {
        dispatch(
            getModalBulkArticle({
                bulkartSeq: bulkartSeq,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        dispatch(
                            showPreviewModal({
                                state: true,
                                activeKey: 0,
                                bulkArticle: body.LIST.list,
                            }),
                        );
                    } else {
                        messageBox.alert(message, () => {});
                    }
                },
            }),
        );
    };

    return (
        <div className="d-flex align-items-center justify-content-center h-100">
            <Button variant="outline-table-btn" size="sm" onClick={() => handleClickPreviewButton()}>
                미리보기
            </Button>
        </div>
    );
};

export default PreviewRenderer;
