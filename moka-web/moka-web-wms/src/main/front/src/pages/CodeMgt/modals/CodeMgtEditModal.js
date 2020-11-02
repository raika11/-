import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MokaModal, MokaInputLabel } from '@components';

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
    const history = useHistory();
    const { show, onHide, type, onSave, onDelete, data } = props;
    // modal 항목 state
    const [grpSeq, setGrpSeq] = useState(0);
    const [cdSeq, setCdSeq] = useState(0);
    const [dtlCd, setDtlCd] = useState('');
    const [cdNm, setCdNm] = useState('');
    const [cdEngNm, setCdEngNm] = useState('');
    const [cdOrd, setCdOrd] = useState(0);
    const [usedYn, setUsedYn] = useState('N');
    const [cdComment, setCdComment] = useState('');
    const [cdNmEtc1, setCdNmEtc1] = useState('');
    const [cdNmEtc2, setCdNmEtc2] = useState('');
    const [cdNmEtc3, setCdNmEtc3] = useState('');

    const [grpCdError, setGrpCdError] = useState(false);
    const [cdNmError, setCdNmError] = useState(false);
    const [cdOrdError, setCdOrdError] = useState(false);

    /**
     * 항목 값 셋팅
     */
    useEffect(() => {
        if (data) {
            setGrpSeq(data.grpSeq);
            setCdSeq(data.seqNo);
            setDtlCd(data.dtlCd);
            setCdNm(data.cdNm);
            setCdEngNm(data.cdEngNm);
            setCdOrd(data.cdOrd);
            setUsedYn(data.usedYn);
            setCdComment(data.cdComment);
            setCdNmEtc1(data.cdNmEtc1);
            setCdNmEtc2(data.cdNmEtc2);
            setCdNmEtc3(data.cdNmEtc3);
        }
    }, [data]);

    /**
     * modal의 항목 값 변경
     */
    const handleChangeValue = ({ target }) => {
        const { name, value, checked } = target;

        if (name === 'dtlCd') {
            setDtlCd(value);
        } else if (name === 'cdNm') {
            setCdNm(value);
        } else if (name === 'cdEngNm') {
            setCdEngNm(value);
        } else if (name === 'cdOrd') {
            setCdOrd(value);
        } else if (name === 'usedYn') {
            const usedVal = checked ? 'Y' : 'N';
            setUsedYn(usedVal);
        } else if (name === 'cdComment') {
            setCdComment(value);
        } else if (name === 'cdNmEtc1') {
            setCdNmEtc1(value);
        } else if (name === 'cdNmEtc2') {
            setCdNmEtc2(value);
        } else if (name === 'cdNmEtc3') {
            setCdNmEtc3(value);
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
     * data
     */
    const code = {
        grpSeq,
        grpCd,
        cdSeq,
        dtlCd,
        cdNm,
        cdEngNm,
        cdOrd,
        usedYn,
        cdComment,
        cdNmEtc1,
        cdNmEtc2,
        cdNmEtc3,
    };

    /**
     * 저장
     */
    const handleClickSave = useCallback(() => {
        if (validate(code)) {
            onSave(code);
            onHide();
            history.push(`/codeMgt/${grpCd}`);
        }
    }, [code, grpCd, history, onHide, onSave]);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(() => {
        if (code) {
            onDelete(code);
            onHide();
            history.push(`/codeMgt/${grpCd}`);
        }
    }, [code, grpCd, history, onDelete, onHide]);

    return (
        <>
            {type === 'add' && (
                <MokaModal
                    draggable
                    show={show}
                    onHide={onHide}
                    title="그룹 추가"
                    buttons={[
                        {
                            text: '등록',
                            variant: 'primary',
                            onClick: handleClickSave,
                        },
                        {
                            text: '취소',
                            variant: 'gray150',
                            onClick: onHide,
                        },
                    ]}
                    footerClassName="justify-content-center"
                >
                    <MokaInputLabel label="코드그룹" value={grpCd} name="grpCd" onChange={handleChangeValue} isInvalid={grpCdError} disabled />
                    <MokaInputLabel label="코드" value={dtlCd} name="dtlCd" onChange={handleChangeValue} />
                    <MokaInputLabel label="코드명" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} />
                    <MokaInputLabel label="영문명" value={cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
                    <MokaInputLabel label="순서" value={cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={cdOrdError} />
                    <MokaInputLabel
                        label="사용여부"
                        as="switch"
                        inputProps={{ checked: usedYn === 'Y' && true }}
                        value={usedYn}
                        id="usedYn"
                        name="usedYn"
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel label="비고" value={cdComment} name="cdComment" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타1" value={cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타2" value={cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타3" value={cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
                </MokaModal>
            )}
            {type === 'edit' && (
                <MokaModal
                    draggable
                    show={show}
                    onHide={onHide}
                    title="그룹 추가"
                    buttons={[
                        {
                            text: '저장',
                            variant: 'primary',
                            onClick: handleClickSave,
                        },
                        {
                            text: '취소',
                            variant: 'gray150',
                            onClick: onHide,
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
                    <MokaInputLabel label="코드" value={dtlCd} name="dtlCd" onChange={handleChangeValue} disabled />
                    <MokaInputLabel label="코드명" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} />
                    <MokaInputLabel label="영문명" value={cdEngNm} name="cdEngNm" onChange={handleChangeValue} />
                    <MokaInputLabel label="순서" value={cdOrd} name="cdOrd" onChange={handleChangeValue} isInvalid={cdOrdError} />
                    <MokaInputLabel
                        label="사용여부"
                        as="switch"
                        inputProps={{ checked: usedYn === 'Y' && true }}
                        value={usedYn}
                        id="usedYn"
                        name="usedYn"
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel label="비고" value={cdComment} name="cdComment" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타1" value={cdNmEtc1} name="cdNmEtc1" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타2" value={cdNmEtc2} name="cdNmEtc2" onChange={handleChangeValue} />
                    <MokaInputLabel label="기타3" value={cdNmEtc3} name="cdNmEtc3" onChange={handleChangeValue} />
                </MokaModal>
            )}
        </>
    );
};

CodeMgtListModal.propTypes = propTypes;
CodeMgtListModal.defaultProps = defaultProps;

export default CodeMgtListModal;
