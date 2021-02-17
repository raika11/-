import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MAX_GROUP_NUMBER, CODETYPE_ART_GROUP_NAME } from '@/constants';
import { MokaModal, MokaInputLabel } from '@components';
import toast from '@utils/toastUtil';
import { getArtGroup, getDtl, saveDtl, GET_DTL_MODAL, GET_GRP_MODAL, SAVE_DTL, GET_ART_GROUP } from '@store/codeMgt';

/**
 * 그룹 갯수 지정하는 모달
 */
const ChangeArtGroupModal = (props) => {
    const { show, onHide, onSave } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_GRP_MODAL] || store.loading[GET_DTL_MODAL] || store.loading[SAVE_DTL] || store.loading[GET_ART_GROUP]);
    const { artGroupRows, dtl } = useSelector((store) => ({
        artGroupRows: store.codeMgt.artGroupRows,
        dtl: store.codeMgt.dtl.dtl,
    }));

    // state
    const [value, setValue] = useState();

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        dispatch(
            saveDtl({
                dtl: {
                    ...dtl,
                    cdNmEtc1: String(value),
                },
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                        if (onSave) {
                            onSave();
                        }
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        setValue('');
        if (onHide) onHide();
    };

    useEffect(() => {
        if (show) {
            if (!artGroupRows) {
                dispatch(getArtGroup());
            } else {
                const code = artGroupRows.find((a) => a.dtlCd === CODETYPE_ART_GROUP_NAME);
                // if (code) {
                //     dispatch(getDtl(code.seqNo));
                // }
            }
        }
    }, [artGroupRows, dispatch, show]);

    useEffect(() => {
        if (show) {
            setValue(dtl.cdNmEtc1);
        }
    }, [dtl, show]);

    return (
        <MokaModal
            width={310}
            title="등록기사리스트 그룹 지정"
            show={show}
            size="sm"
            onHide={handleHide}
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
            centered
            loading={loading}
        >
            <MokaInputLabel label="그룹개수" as="select" className="mb-0" value={value} onChange={(e) => setValue(e.target.value)}>
                {[...Array(MAX_GROUP_NUMBER)].map(
                    (x, i) =>
                        i > 0 && (
                            <option key={i} value={i + 1}>
                                {i + 1}개
                            </option>
                        ),
                )}
            </MokaInputLabel>
        </MokaModal>
    );
};

export default ChangeArtGroupModal;
