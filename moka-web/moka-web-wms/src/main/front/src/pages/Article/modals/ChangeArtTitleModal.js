import React, { useState } from 'react';
// import { useSelector, useDispatch, shallowEqual } from 'react-redux';;
import { MokaModal, MokaInputLabel } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
// import toast from '@utils/toastUtil';
// import { getCodeMgtGrp, getArtGroup, getCodeMgt, saveCodeMgt, changeCd, GET_CODE_MGT, GET_CODE_MGT_GRP, SAVE_CODE_MGT, GET_ART_GROUP } from '@store/codeMgt';
// import { getArticleList } from '@store/article';

/**
 * 기사별 웹제목 / 모바일제목 수정하는 모달
 */
const ChangeArtGroupModal = (props) => {
    const { show, onHide, artData } = props;

    // state
    const [webTitle, setWebTitle] = useState('');
    const [mTitle, setMTitle] = useState('');

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        // dispatch(
        //     saveCodeMgt({
        //         type: 'update',
        //         actions: [
        //             changeCd({
        //                 ...cd,
        //                 cdNmEtc1: String(value),
        //             }),
        //         ],
        //         callback: ({ header }) => {
        //             if (header.success) {
        //                 toast.success(header.message);
        //                 dispatch(getArticleList());
        //             } else {
        //                 toast.warn(header.message);
        //             }
        //         },
        //     }),
        // );
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        if (onHide) onHide();
        setWebTitle('');
        setMTitle('');
    };

    // useEffect(() => {
    //     if (show) {
    //         if (artGroupRows.length < 1) {
    //             dispatch(getArtGroup());
    //         }
    //     }
    // }, [artGroupRows.length, dispatch, show]);

    return (
        <MokaModal
            width={530}
            title={unescapeHtml(artData.artTitle || '')}
            show={show}
            size="md"
            onHide={handleHide}
            footerClassName="d-flex justify-content-center"
            buttons={[
                {
                    text: '저장',
                    variant: 'positive',
                    onClick: handleClickSave,
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: handleHide,
                },
            ]}
            draggable
            centered
        >
            <MokaInputLabel label="웹제목" className="mb-2" value={webTitle} onChange={(e) => setWebTitle(e.target.value)} />

            <MokaInputLabel
                label={
                    <React.Fragment>
                        모바일
                        <br />
                        제목
                    </React.Fragment>
                }
                className="mb-0"
                value={mTitle}
                onChange={(e) => setMTitle(e.target.value)}
            />
        </MokaModal>
    );
};

export default ChangeArtGroupModal;
