import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaInputLabel } from '@components';
import { initialState, getDtlModal, saveDtl, existsDtl, deleteDtl, GET_DTL_MODAL, SAVE_DTL, EXISTS_DTL, DELETE_DTL } from '@store/codeMgt';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';

/**
 * 상세코드 편집 모달
 */
const EditDtlModal = ({ show, onHide, seqNo, grpCd, grp }) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_DTL_MODAL] || loading[EXISTS_DTL] || loading[SAVE_DTL] || loading[DELETE_DTL]);
    const [dtl, setDtl] = useState(initialState.dtl.dtl);
    const [error, setError] = useState({});

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setDtl(initialState.dtl.dtl);
        setError({});
        onHide();
    };

    /**
     * 상세코드 조회
     * @param {*} seqNo seqNo
     */
    const getDtl = useCallback(
        (seqNo) => {
            dispatch(
                getDtlModal({
                    seqNo,
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        } else {
                            setDtl(body);
                            setError({});
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * 입력값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;
        setDtl({ ...dtl, [name]: name === 'usedYn' ? (checked ? 'Y' : 'N') : value });

        if (error[name]) {
            setError({ ...error, [name]: false });
        }
    };

    /**
     * 유효성 검사
     * @param {object} 검사 대상
     */
    const validate = (obj) => {
        let isInvalid = false,
            errList = [];

        if (!obj.dtlCd) {
            errList.push({
                field: 'dtlCd',
                reason: '코드는 필수 입력 항목입니다.',
            });
            isInvalid = isInvalid | true;
        }
        if (!/^[A-Za-z0-9_-`/]+$/g.test(obj.dtlCd)) {
            errList.push({
                field: 'dtlCd',
                reason: '코드 형식이 올바르지 않습니다. 영문 대소문자, 숫자, _, -만 입력 가능합니다.',
            });
            isInvalid = isInvalid | true;
        }
        if (!obj.cdNm) {
            errList.push({
                field: 'cdNm',
                reason: '코드 한글명은 필수 입력 항목입니다.',
            });
            isInvalid = isInvalid | true;
        }
        if (!obj.cdOrd) {
            errList.push({
                field: 'cdOrd',
                reason: '순서는 필수 입력 항목입니다.',
            });
            isInvalid = isInvalid | true;
        }
        if (!/^[0-9]+$/g.test(obj.cdOrd)) {
            errList.push({
                field: 'cdOrd',
                reason: '순서는 숫자만 입력 가능합니다.',
            });
            isInvalid = isInvalid | true;
        }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 상세코드 저장
     */
    const handleClickSave = () => {
        const saveFunc = (dtl) => {
            dispatch(
                saveDtl({
                    dtl,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            handleHide();
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        };

        if (validate(dtl)) {
            if (seqNo) {
                // 수정
                saveFunc(dtl);
            } else {
                // 등록 (grpCd안의 dtlCd 중복체크 후 저장)
                dispatch(
                    existsDtl({
                        grpCd: grpCd,
                        dtlCd: dtl.dtlCd,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                if (!body) {
                                    // 중복 없음 => 저장
                                    saveFunc({
                                        ...dtl,
                                        codeMgtGrp: grp || {},
                                    });
                                } else {
                                    // 중복 있음
                                    messageBox.alert('중복된 그룹코드명이 존재합니다.');
                                }
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            }
        }
    };

    /**
     * 상세코드 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm('코드를 삭제하시겠습니까?', () => {
            dispatch(
                deleteDtl({
                    seqNo: seqNo,
                    callback: ({ header, body }) => {
                        if (header.success && body) {
                            toast.success(header.message);
                            handleHide();
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        });
    };

    useEffect(() => {
        if (seqNo && show) {
            // 수정 => 데이터 조회
            getDtl(seqNo);
        } else {
            setDtl(initialState.dtl.dtl);
            setError({});
        }
    }, [show, seqNo, getDtl]);

    return (
        <MokaModal
            width={600}
            size="md"
            show={show}
            onHide={handleHide}
            title={seqNo ? '코드 수정' : '코드 등록'}
            buttons={[
                {
                    text: seqNo ? '수정' : '등록',
                    variant: 'positive',
                    onClick: handleClickSave,
                },
                seqNo && {
                    text: '삭제',
                    variant: 'negative',
                    onClick: handleClickDelete,
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: handleHide,
                },
            ].filter((a) => a)}
            footerClassName="justify-content-center"
            centered
            loading={loading}
        >
            <MokaInputLabel
                label="사용여부"
                as="switch"
                inputProps={{ checked: dtl.usedYn === 'Y' && true }}
                id="usedYn"
                name="usedYn"
                className="mb-2"
                onChange={handleChangeValue}
            />
            <MokaInputLabel label="코드 그룹" className="mb-2" value={grpCd} name="grpCd" onChange={handleChangeValue} disabled />
            <MokaInputLabel label="코드" className="mb-2" value={dtl.dtlCd} name="dtlCd" onChange={handleChangeValue} isInvalid={error.dtlCd} disabled={seqNo ? true : false} />
            <MokaInputLabel label="코드 한글명" className="mb-2" value={dtl.cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={error.cdNm} />
            <MokaInputLabel label="코드 영문명" className="mb-2" value={dtl.cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
            <MokaInputLabel label="순서" className="mb-2" value={dtl.cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={error.cdOrd} />
            <MokaInputLabel label="코드 설명" className="mb-2" value={dtl.cdComment} name="cdComment" onChange={handleChangeValue} />
            <MokaInputLabel label="기타1" className="mb-2" value={dtl.cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
            <MokaInputLabel label="기타2" className="mb-2" value={dtl.cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
            <MokaInputLabel label="기타3" value={dtl.cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
        </MokaModal>
    );
};

export default EditDtlModal;
