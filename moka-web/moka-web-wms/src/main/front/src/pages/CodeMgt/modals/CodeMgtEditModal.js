import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MokaModal, MokaInputLabel } from '@components';
import { clearCd } from '@store/codeMgt';

const propTypes = {
    /**
     * show
     */
    show: PropTypes.bool.isRequired,
    /**
     * hide 함수
     */
    onHide: PropTypes.func.isRequired,
    /**
     * type 모달 type
     */
    type: PropTypes.string,
    /**
     * onSave 함수
     */
    onSave: PropTypes.func,
    /**
     * onDelete 함수
     */
    onDelete: PropTypes.func,
};
const defaultProps = {
    type: '',
    onSave: null,
    onDelete: null,
};

/**
 * 기타코드 편집 모달 컴포넌트
 */
const CodeMgtListModal = (props) => {
    const { grpCd } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { show, onHide, type, onSave, onDelete } = props;
    const { cd } = useSelector((store) => ({
        cd: store.codeMgt.cd,
    }));
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

    const [grpCdError, setGrpCdError] = useState(false);
    const [cdNmError, setCdNmError] = useState(false);
    const [cdOrdError, setCdOrdError] = useState(false);

    /**
     * 항목 값 셋팅
     */
    useEffect(() => {
        setStateObj(cd);
    }, [cd]);

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;

        if (name === 'dtlCd') {
            setStateObj({ ...stateObj, dtlCd: value });
        } else if (name === 'cdNm') {
            setStateObj({ ...stateObj, cdNm: value });
        } else if (name === 'cdEngNm') {
            setStateObj({ ...stateObj, cdEngNm: value });
        } else if (name === 'cdOrd') {
            setStateObj({ ...stateObj, cdOrd: value });
        } else if (name === 'usedYn') {
            const usedVal = checked ? 'Y' : 'N';
            setStateObj({ ...stateObj, usedYn: usedVal });
        } else if (name === 'cdComment') {
            setStateObj({ ...stateObj, cdComment: value });
        } else if (name === 'cdNmEtc1') {
            setStateObj({ ...stateObj, cdNmEtc1: value });
        } else if (name === 'cdNmEtc2') {
            setStateObj({ ...stateObj, cdNmEtc2: value });
        } else if (name === 'cdNmEtc3') {
            setStateObj({ ...stateObj, cdNmEtc3: value });
        }
    };

    /**
     * 입력된 validate체크
     * @param {} obj
     */
    const validate = (obj) => {
        let totErr = [];

        if (!/^[A-Za-z0-9_-`/]+$/g.test(obj.grpCd)) {
            let err = {
                field: 'grpCd',
                reason: '그룹 아이디를 확인해주세요',
            };
            totErr.push(err);
            setGrpCdError(true);
        }
        if (!/[^\s\t\n]+/g.test(obj.cdNm)) {
            let err = {
                field: 'cdNm',
                reason: '그룹명을 확인해주세요',
            };
            totErr.push(err);
            setCdNmError(true);
        }
        if (!/[^\s\t\n]+/g.test(obj.cdOrd)) {
            let err = {
                field: 'cdOrd',
                reason: '순서를 확인해주세요',
            };
            totErr.push(err);
            setCdOrdError(true);
        }
        if (totErr.length < 1) {
            return true;
        }
        return false;
    };

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
            onHide();
            history.push(`/codeMgt/${grpCd}`);
        }
    }, [grpCd, history, onHide, onSave, stateObj]);

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
            history.push(`/codeMgt/${grpCd}`);
        }
    }, [grpCd, history, onDelete, onHide, stateObj]);

    return (
        <>
            {type === 'add' && (
                <MokaModal
                    draggable
                    show={show}
                    onHide={() => {
                        setStateObj({});
                        onHide();
                    }}
                    title="코드 추가"
                    buttons={[
                        {
                            text: '등록',
                            variant: 'primary',
                            onClick: handleClickSave,
                        },
                        {
                            text: '취소',
                            variant: 'gray150',
                            onClick: () => {
                                setStateObj({});
                                onHide();
                            },
                        },
                    ]}
                    footerClassName="justify-content-center"
                >
                    <MokaInputLabel label="코드그룹" value={grpCd} name="grpCd" onChange={handleChangeValue} isInvalid={grpCdError} disabled />
                    <MokaInputLabel label="코드" value={stateObj.dtlCd} name="dtlCd" onChange={handleChangeValue} />
                    <MokaInputLabel label="코드명" value={stateObj.cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} />
                    <MokaInputLabel label="영문명" value={stateObj.cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
                    <MokaInputLabel label="순서" value={stateObj.cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={cdOrdError} />
                    <MokaInputLabel
                        label="사용여부"
                        as="switch"
                        inputProps={{ checked: stateObj.usedYn === 'Y' && true }}
                        value={stateObj.usedYn}
                        id="usedYn"
                        name="usedYn"
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel label="비고" value={stateObj.cdComment} name="cdComment" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타1" value={stateObj.cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타2" value={stateObj.cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타3" value={stateObj.cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
                </MokaModal>
            )}
            {type === 'edit' && (
                <MokaModal
                    draggable
                    show={show}
                    onHide={() => {
                        onHide();
                        history.push(`/codeMgt/${grpCd}`);
                        dispatch(clearCd());
                    }}
                    title="코드 수정"
                    buttons={[
                        {
                            text: '저장',
                            variant: 'primary',
                            onClick: handleClickSave,
                        },
                        {
                            text: '취소',
                            variant: 'gray150',
                            onClick: () => {
                                onHide();
                                history.push(`/codeMgt/${grpCd}`);
                                dispatch(clearCd());
                            },
                        },
                        {
                            text: '삭제',
                            variant: 'gray150',
                            onClick: handleClickDelete,
                        },
                    ]}
                    footerClassName="justify-content-center"
                >
                    <MokaInputLabel label="코드그룹" value={grpCd} name="grpCd" onChange={handleChangeValue} isInvalid={grpCdError} disabled />
                    <MokaInputLabel label="코드" value={stateObj.dtlCd} name="dtlCd" onChange={handleChangeValue} disabled />
                    <MokaInputLabel label="코드명" value={stateObj.cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} />
                    <MokaInputLabel label="영문명" value={stateObj.cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
                    <MokaInputLabel label="순서" value={stateObj.cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={cdOrdError} />
                    <MokaInputLabel
                        label="사용여부"
                        as="switch"
                        inputProps={{ checked: stateObj.usedYn === 'Y' && true }}
                        value={stateObj.usedYn}
                        id="usedYn"
                        name="usedYn"
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel label="비고" value={stateObj.cdComment} name="cdComment" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타1" value={stateObj.cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타2" value={stateObj.cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타3" value={stateObj.cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
                </MokaModal>
            )}
        </>
    );
};

CodeMgtListModal.propTypes = propTypes;
CodeMgtListModal.defaultProps = defaultProps;

export default CodeMgtListModal;
