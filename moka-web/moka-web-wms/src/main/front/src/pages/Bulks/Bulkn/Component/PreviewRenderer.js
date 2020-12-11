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
                callback: ({ header: { success, message }, body: { list } }) => {
                    if (success === true) {
                        dispatch(
                            showPreviewModal({
                                state: true,
                                bulkArticle: list,
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
        <>
            <Button variant="outline-table-btn" className="mr-05" onClick={() => handleClickPreviewButton()}>
                미리보기
            </Button>
        </>
    );
};

export default PreviewRenderer;
