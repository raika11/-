import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaInputLabel } from '@components';
import { changeGrpInvalidList } from '@store/codeMgt';
import { invalidListToError } from '@utils/convertUtil';
import { messageBox } from '@utils/toastUtil';

/**
 * 기타코드 리스트 모달 컴포넌트
 */
const CodeMgtListModal = (props) => {
    const { show, onHide, onSave, onDelete, data } = props;
    const dispatch = useDispatch();
    const grpInvalidList = useSelector((store) => store.codeMgt.grpInvalidList);

    // modal 항목 state
    const [grpSeq, setGrpSeq] = useState('');
    const [grpCd, setGrpCd] = useState('');
    const [cdNm, setCdNm] = useState('');
    const [error, setError] = useState({});

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value } = target;

        if (name === 'grpCd') {
            setGrpCd(value);
        } else if (name === 'cdNm') {
            setCdNm(value);
        }
    };

    /**
     * 입력된 그룹 validate체크
     * @param {object} obj
     */
    const validate = (obj) => {
        let isInvalid = false,
            errList = [];

        if (!obj.grpCd) {
            errList.push({
                field: 'grpCd',
                reason: '그룹 코드는 필수 입력 항목입니다.',
            });
            isInvalid = isInvalid | true;
        }

        if (!/^[A-Za-z0-9_-`/]+$/g.test(obj.grpCd)) {
            errList.push({
                field: 'grpCd',
                reason: '그룹 코드 형식이 올바르지 않습니다. 영문 대소문자, 숫자, _, -만 입력 가능합니다.',
            });
            isInvalid = isInvalid || true;
        }

        if (!obj.cdNm) {
            errList.push({
                field: 'cdNm',
                reason: '그룹명은 필수 입력 항목입니다.',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeGrpInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setGrpCd('');
        setCdNm('');
        setError({});
        onHide();
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        const codeGrp = {
            grpSeq,
            grpCd,
            cdNm,
        };

        if (validate(codeGrp)) {
            onSave(codeGrp);
            handleHide();
        }
    };

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        const codeGrp = {
            grpSeq,
            grpCd,
            cdNm,
        };

        if (codeGrp) {
            onDelete(codeGrp);
            handleHide();
        }
    };

    /**
     * 항목 값 셋팅
     */
    useEffect(() => {
        if (show && data) {
            setGrpSeq(data.seqNo);
            setGrpCd(data.grpCd);
            setCdNm(data.cdNm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, data]);

    useEffect(() => {
        if (grpInvalidList !== null) {
            setError(invalidListToError(grpInvalidList));

            // alert message 동시에 여러개일 경우.
            // messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
            if (grpInvalidList.length > 0) {
                // alert message 처음 메시지 하나만.
                messageBox.alert(grpInvalidList[0].reason, () => {});
            }
        }
    }, [dispatch, grpInvalidList]);

    return (
        <>
            <MokaModal
                width={600}
                size="md"
                draggable
                show={show}
                onHide={handleHide}
                title={data.seqNo ? '그룹 수정' : '그룹 등록'}
                buttons={
                    data.seqNo
                        ? [
                              {
                                  text: '수정',
                                  variant: 'positive',
                                  onClick: handleClickSave,
                              },
                              {
                                  text: '취소',
                                  variant: 'negative',
                                  onClick: handleHide,
                              },
                              {
                                  text: '삭제',
                                  variant: 'negative',
                                  onClick: handleClickDelete,
                              },
                          ]
                        : [
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
                          ]
                }
                footerClassName="justify-content-center"
                centered
            >
                <MokaInputLabel
                    label="그룹 코드"
                    placeholder="그룹 코드(영문 대, 소문자, 숫자, _, -만 입력 가능)"
                    className="mb-2"
                    value={grpCd}
                    name="grpCd"
                    onChange={handleChangeValue}
                    disabled={data.seqNo ? true : false}
                    isInvalid={error.grpCd}
                    required
                />
                <MokaInputLabel label="그룹명" className="mb-2" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={error.cdNm} required />
            </MokaModal>
        </>
    );
};

export default CodeMgtListModal;
