import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MokaModal, MokaInputLabel } from '@components';
import { clearCd, changeCdInvalidList } from '@store/codeMgt';
import { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';

/**
 * 기타코드 편집 모달
 */
const CodeMgtEditModal = (props) => {
    const { show, onHide, onSave, onDelete } = props;
    const { grpCd } = useParams();
    const dispatch = useDispatch();
    const cd = useSelector((store) => store.codeMgt.cd);
    const cdInvalidList = useSelector((store) => store.codeMgt.cdInvalidList);

    // modal 항목 state
    const [stateObj, setStateObj] = useState({
        cdSeq: '',
        dtlCd: '',
        cdNm: '',
        cdEngNm: '',
        cdOrd: '',
        usedYn: 'N',
        cdComment: '',
        cdNmEtc1: '',
        cdNmEtc2: '',
        cdNmEtc3: '',
    });
    const [error, setError] = useState({});

    /**
     * input value
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;
        if (name === 'usedYn') {
            setStateObj({ ...stateObj, usedYn: checked ? 'Y' : 'N' });
        } else {
            setStateObj({ ...stateObj, [name]: value });
        }
    };

    /**
     * 입력된 validate체크
     * @param {} obj
     */
    const validate = useCallback(
        (obj) => {
            let isInvalid = false,
                errList = [];

            // if (!obj.grpCd || !/^[A-Za-z0-9_-`/]+$/g.test(obj.grpCd)) {
            //     errList.push({
            //         field: 'grpCd',
            //         reason: '그룹 아이디를 확인해주세요',
            //     });
            //     isInvalid = isInvalid | true;
            // }
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

            dispatch(changeCdInvalidList(errList));
            return !isInvalid;
        },
        [dispatch],
    );

    /**
     * 저장
     */
    const handleClickSave = useCallback(() => {
        const code = {
            ...stateObj,
            grpCd,
        };

        if (validate(code)) {
            onSave(code);
            setStateObj({});
            onHide();
        }
    }, [grpCd, onHide, onSave, stateObj, validate]);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(() => {
        const code = {
            ...stateObj,
            grpCd,
        };

        if (code) {
            onDelete(code);
            onHide();
        }
    }, [grpCd, onDelete, onHide, stateObj]);

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setStateObj({});
        setError({});
        dispatch(clearCd());
        onHide();
    };

    /**
     * 항목 값 셋팅
     */
    useEffect(() => {
        if (cd.seqNo && show) {
            setStateObj(cd);
        }
    }, [cd, show]);

    useEffect(() => {
        if (cdInvalidList !== null) {
            setError(invalidListToError(cdInvalidList));

            // alert message 동시에 여러개일 경우.
            // messageBox.alert(invalidList.map((element) => element.reason).join('\n'), () => {});
            if (cdInvalidList.length > 0) {
                // alert message 처음 메시지 하나만.
                messageBox.alert(cdInvalidList[0].reason, () => {});
            }
        }
    }, [dispatch, cdInvalidList]);

    return (
        <MokaModal
            width={600}
            size="md"
            draggable
            show={show}
            onHide={handleHide}
            title={cd.seqNo ? '코드 수정' : '코드 등록'}
            buttons={
                cd.seqNo
                    ? [
                          {
                              text: '수정',
                              variant: 'positive',
                              onClick: handleClickSave,
                          },
                          {
                              text: '삭제',
                              variant: 'negative',
                              onClick: handleClickDelete,
                          },
                          {
                              text: '취소',
                              variant: 'negative',
                              onClick: handleHide,
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
                label="사용여부"
                as="switch"
                inputProps={{ checked: stateObj.usedYn === 'Y' && true }}
                value={stateObj.usedYn}
                id="usedYn"
                name="usedYn"
                className="mb-2"
                onChange={handleChangeValue}
            />
            <MokaInputLabel label="코드 그룹" className="mb-2" value={grpCd} name="grpCd" onChange={handleChangeValue} isInvalid={error.grpCd} disabled />
            <MokaInputLabel
                label="코드"
                className="mb-2"
                value={stateObj.dtlCd}
                name="dtlCd"
                onChange={handleChangeValue}
                isInvalid={error.dtlCd}
                disabled={cd.seqNo ? true : false}
            />
            <MokaInputLabel label="코드 한글명" className="mb-2" value={stateObj.cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={error.cdNm} />
            <MokaInputLabel label="코드 영문명" className="mb-2" value={stateObj.cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
            <MokaInputLabel label="순서" className="mb-2" value={stateObj.cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={error.cdOrd} />
            <MokaInputLabel label="코드 설명" className="mb-2" value={stateObj.cdComment} name="cdComment" onChange={handleChangeValue} />
            <MokaInputLabel label="기타1" className="mb-2" value={stateObj.cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
            <MokaInputLabel label="기타2" className="mb-2" value={stateObj.cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
            <MokaInputLabel label="기타3" value={stateObj.cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
        </MokaModal>
    );
};

export default CodeMgtEditModal;
