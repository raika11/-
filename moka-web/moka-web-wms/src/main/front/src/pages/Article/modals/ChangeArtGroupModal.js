import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { MAX_GROUP_NUMBER, CODETYPE_ART_GROUP_NAME, CODETYPE_ART_GROUP } from '@/constants';
import { MokaModal, MokaInputLabel } from '@components';
import toast from '@utils/toastUtil';
import { getCodeMgtGrp, getArtGroup, getCodeMgt, saveCodeMgt, changeCd, GET_CODE_MGT, GET_CODE_MGT_GRP, SAVE_CODE_MGT, GET_ART_GROUP } from '@store/codeMgt';
import { getArticleList } from '@store/article';

/**
 * 그룹 갯수 지정하는 모달
 */
const ChangeArtGroupModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();
    const { artGroupRows, cd, loading } = useSelector(
        (store) => ({
            artGroupRows: store.codeMgt.artGroupRows,
            cd: store.codeMgt.cd,
            loading: store.loading[GET_CODE_MGT_GRP] || store.loading[GET_CODE_MGT] || store.loading[SAVE_CODE_MGT] || store.loading[GET_ART_GROUP],
        }),
        shallowEqual,
    );

    // state
    const [value, setValue] = useState();

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        dispatch(
            saveCodeMgt({
                type: 'update',
                actions: [
                    changeCd({
                        ...cd,
                        cdNmEtc1: String(value),
                    }),
                ],
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                        dispatch(getArticleList());
                    } else {
                        toast.warn(header.message);
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
            if (artGroupRows.length < 1) {
                dispatch(getArtGroup());
            }
        }
    }, [artGroupRows.length, dispatch, show]);

    useEffect(() => {
        const code = artGroupRows.find((a) => a.dtlCd === CODETYPE_ART_GROUP_NAME);
        if (code) {
            dispatch(getCodeMgtGrp(CODETYPE_ART_GROUP));
            dispatch(getCodeMgt(code.seqNo));
        }
    }, [artGroupRows, dispatch]);

    useEffect(() => {
        if (show) {
            setValue(cd.cdNmEtc1);
        }
    }, [cd, show]);

    return (
        <MokaModal
            width={310}
            title="등록기사리스트 그룹 지정"
            show={show}
            size="sm"
            onHide={handleHide}
            footerClassName="d-flex justify-content-center"
            buttons={[
                {
                    text: '저장',
                    variant: 'positive',
                    onClick: handleClickSave,
                },
            ]}
            draggable
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
