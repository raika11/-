import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MokaModal, MokaInputLabel } from '@components';
import { clearCd } from '@store/codeMgt';
import { messageBox } from '@utils/toastUtil';

const propTypes = {
    show: PropTypes.bool.isRequired,
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
 * 기타코드 편집 모달
 */
const CodeMgtEditModal = (props) => {
    const { show, onHide, type, onSave, onDelete, match } = props;
    const { grpCd } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
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
    const validate = (obj) => {
        let totErr = [];

        if (!obj.grpCd || !/^[A-Za-z0-9_-`/]+$/g.test(obj.grpCd)) {
            let err = {
                field: 'grpCd',
                reason: '그룹 아이디를 확인해주세요',
            };
            totErr.push(err);
            setGrpCdError(true);
        }
        if (!obj.cdNm || !/[^\s\t\n]+/g.test(obj.cdNm)) {
            let err = {
                field: 'cdNm',
                reason: '코드명을 확인해주세요',
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
            history.push(`${match.path}/${grpCd}`);
        }
    }, [grpCd, history, match.path, onHide, onSave, stateObj]);

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
            history.push(`${match.path}/${grpCd}`);
        }
    }, [grpCd, history, match.path, onDelete, onHide, stateObj]);

    /**
     * 취소
     */
    const handleClickCancel = () => {
        onHide();
    };

    return (
        <>
            {type === 'add' && (
                <MokaModal
                    width={600}
                    size="md"
                    draggable
                    show={show}
                    onHide={() => {
                        setStateObj({});
                        onHide();
                    }}
                    title="코드 등록"
                    buttons={[
                        {
                            text: '저장',
                            variant: 'positive',
                            onClick: handleClickSave,
                        },
                        {
                            text: '취소',
                            variant: 'negative',
                            onClick: handleClickCancel,
                        },
                    ]}
                    footerClassName="justify-content-center"
                    centered
                >
                    <MokaInputLabel label="코드그룹" className="mb-2" value={grpCd} name="grpCd" onChange={handleChangeValue} isInvalid={grpCdError} disabled />
                    <MokaInputLabel label="코드" className="mb-2" value={stateObj.dtlCd} name="dtlCd" onChange={handleChangeValue} />
                    <MokaInputLabel label="코드명" className="mb-2" value={stateObj.cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} />
                    <MokaInputLabel label="영문명" className="mb-2" value={stateObj.cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
                    <MokaInputLabel label="순서" className="mb-2" value={stateObj.cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={cdOrdError} />
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
                    <MokaInputLabel label="비고" className="mb-2" value={stateObj.cdComment} name="cdComment" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타1" className="mb-2" value={stateObj.cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타2" className="mb-2" value={stateObj.cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타3" value={stateObj.cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
                </MokaModal>
            )}
            {type === 'edit' && (
                <MokaModal
                    width={600}
                    size="md"
                    draggable
                    show={show}
                    onHide={() => {
                        onHide();
                        history.push(`${match.path}/${grpCd}`);
                        dispatch(clearCd());
                    }}
                    title="코드 수정"
                    buttons={[
                        {
                            text: '저장',
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
                            onClick: handleClickCancel,
                        },
                    ]}
                    footerClassName="justify-content-center"
                    centered
                >
                    <MokaInputLabel label="코드그룹" className="mb-2" value={grpCd} name="grpCd" onChange={handleChangeValue} isInvalid={grpCdError} disabled />
                    <MokaInputLabel label="코드" className="mb-2" value={stateObj.dtlCd} name="dtlCd" onChange={handleChangeValue} disabled />
                    <MokaInputLabel label="코드명" className="mb-2" value={stateObj.cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} />
                    <MokaInputLabel label="영문명" className="mb-2" value={stateObj.cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
                    <MokaInputLabel label="순서" className="mb-2" value={stateObj.cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={cdOrdError} />
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
                    <MokaInputLabel label="비고" className="mb-2" value={stateObj.cdComment} name="cdComment" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타1" className="mb-2" value={stateObj.cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타2" className="mb-2" value={stateObj.cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타3" value={stateObj.cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
                </MokaModal>
            )}
        </>
    );
};

CodeMgtEditModal.propTypes = propTypes;
CodeMgtEditModal.defaultProps = defaultProps;

export default CodeMgtEditModal;
