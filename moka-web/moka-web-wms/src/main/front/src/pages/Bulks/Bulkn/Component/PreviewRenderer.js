import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { showPreviewModal } from '@store/bulks';

// grid 미리보기 버튼 렌더.
const PreviewRenderer = () => {
    const dispatch = useDispatch();

    // 리스트에서 미리보기 버튼을 클릭하면 grid row 클릭도 이벤트가 같이 먹기 때문에
    // 미리보기 클릭시 api 를 호출 하면 같은 Action 이 발생해서
    // grid row 클릭시 발생하는 action 이 끝나고 Store bulkartice 값이 변경 될때 모달창을 띄우게 처리
    // 미리보기 버튼 클릭 -> buttonClickState 상태 변경 -> buttonClickState 값이 true 이고 Store bulkarticle 값이 변경 되면 모달 창을 띄움.
    const [buttonClickState, setButtonClickState] = useState(false);

    // 모달 store 에 bulk article 연결.
    const { bulkArticle, previewModal } = useSelector((store) => ({
        bulkArticle: store.bulks.bulkArticle,
        previewModal: store.bulks.previewModal,
    }));

    // 미리 보기 버튼 상태 변경.
    const handleClickPreviewButton = () => {
        setButtonClickState(true);
    };

    // buttonClickState, bulkArticle, dispatch 값들이 변경되면 실제 미리보기 모달창에 값 전달후 띄움.
    useEffect(() => {
        if (buttonClickState === true) {
            dispatch(
                showPreviewModal({
                    state: true,
                    bulkArticle: bulkArticle.list,
                }),
            );
        }
    }, [buttonClickState, bulkArticle, dispatch]);

    // 모달 창이 닫혔을 경우 상태도 false 로 변경.
    useEffect(() => {
        if (previewModal.state === false) {
            setButtonClickState(false);
        }
    }, [previewModal.state]);

    return (
        <>
            <Button variant="outline-table-btn" className="mr-05" onClick={() => handleClickPreviewButton()}>
                미리보기
            </Button>
        </>
    );
};

export default PreviewRenderer;
