import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaInputLabel } from '@components';
import { initialState, getGrpModal, existsGrp, saveGrp, deleteGrp, GET_GRP_MODAL, EXISTS_DTL, SAVE_GRP, DELETE_GRP } from '@store/codeMgt';
import { invalidListToError } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';

/**
 * 그룹코드 편집모달
 */
const EditGrpModal = ({ show, onHide, grpCd }) => {
    const dispatch = useDispatch();
    const [grp, setGrp] = useState(initialState.grp);
    const loading = useSelector(({ loading }) => loading[GET_GRP_MODAL] || loading[EXISTS_DTL] || loading[SAVE_GRP] || loading[DELETE_GRP]);
    const [error, setError] = useState({});

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setGrp(initialState.grp);
        setError({});
        onHide();
    };

    /**
     * 그룹코드 조회
     * @param {*} grpCd grpCd
     */
    const getGrp = useCallback(
        (grpCd) => {
            dispatch(
                getGrpModal({
                    grpCd,
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        } else {
                            setGrp(body);
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
        const { name, value } = target;
        setGrp({ ...grp, [name]: value });

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

        if (!obj.grpCd) {
            errList.push({
                field: 'grpCd',
                reason: '코드는 필수 입력 항목입니다',
            });
            isInvalid = isInvalid | true;
        }

        if (!/^[A-Za-z0-9_-]+$/g.test(obj.grpCd)) {
            errList.push({
                field: 'grpCd',
                reason: '코드 형식이 올바르지 않습니다. 영문 대소문자, 숫자, _, -만 입력 가능합니다',
            });
            isInvalid = isInvalid || true;
        }

        if (!obj.cdNm) {
            errList.push({
                field: 'cdNm',
                reason: '그룹명은 필수 입력 항목입니다',
            });
            isInvalid = isInvalid | true;
        }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 그룹코드 저장
     */
    const handleClickSave = () => {
        const saveFunc = (grp) => {
            dispatch(
                saveGrp({
                    grp,
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

        if (validate(grp)) {
            if (grpCd) {
                // 수정
                saveFunc(grp);
            } else {
                // 등록 (grpCd 중복체크 후 저장)
                dispatch(
                    existsGrp({
                        grpCd: grp.grpCd,
                        callback: ({ header, body }) => {
                            if (header.success) {
                                if (!body) {
                                    // 중복 없음 => 저장
                                    saveFunc(grp);
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
     * 그룹코드 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm('선택하신 그룹코드의 하위 코드도 전부 삭제됩니다.\n그룹코드를 삭제하시겠습니까?', () => {
            dispatch(
                deleteGrp({
                    seqNo: grp.seqNo,
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
        if (show && grpCd) {
            // 수정 => 데이터 조회
            getGrp(grpCd);
        } else {
            setGrp(initialState.grp);
            setError({});
        }
    }, [show, grpCd, getGrp]);

    return (
        <MokaModal
            width={600}
            size="md"
            show={show}
            onHide={handleHide}
            title={grpCd ? '그룹 수정' : '그룹 등록'}
            buttons={[
                {
                    text: grpCd ? '수정' : '등록',
                    variant: 'positive',
                    onClick: handleClickSave,
                },
                grpCd && {
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
            centered
            loading={loading}
        >
            <MokaInputLabel
                label="그룹코드"
                placeholder="영문 대, 소문자, 숫자, _, -만 입력 가능합니다"
                className="mb-2"
                value={grp.grpCd}
                name="grpCd"
                onChange={handleChangeValue}
                disabled={grpCd ? true : false}
                isInvalid={error.grpCd}
                invalidMessage={error.grpCdMessage}
                required
            />
            <MokaInputLabel
                label="그룹명"
                className="mb-2"
                value={grp.cdNm}
                name="cdNm"
                onChange={handleChangeValue}
                isInvalid={error.cdNm}
                invalidMessage={error.cdNmMessage}
                required
            />
        </MokaModal>
    );
};

export default EditGrpModal;
