import React, { useState, useEffect } from 'react';
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
 * 기타코드 리스트 모달 컴포넌트
 */
const CodeMgtListModal = (props) => {
    const { show, onHide, type, onSave, onDelete, data } = props;

    // modal 항목 state
    const [grpSeq, setGrpSeq] = useState(0);
    const [grpCd, setGrpCd] = useState('');
    const [cdNm, setCdNm] = useState('');
    const [grpCdError, setGrpCdError] = useState(false);
    const [cdNmError, setCdNmError] = useState(false);

    /**
     * 항목 값 셋팅
     */
    useEffect(() => {
        if (show && data) {
            setGrpSeq(data.grpSeq);
            setGrpCd(data.grpCd);
            setCdNm(data.cdNm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, data]);

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
     * @param {} obj
     */
    const validate = (obj) => {
        let totErr = [];

        if (!/^[A-Za-z0-9_-`/]+$/g.test(obj.grpCd)) {
            let err = {
                field: 'grpCd',
                reason: '코드그룹아이디를 확인해주세요',
            };
            totErr.push(err);
            setGrpCdError(true);
        }
        if (!/[^\s\t\n]+/g.test(obj.cdNm)) {
            let err = {
                field: 'cdNm',
                reason: '코드그룹명을 확인해주세요',
            };
            totErr.push(err);
            setCdNmError(true);
        }
        if (totErr.length < 1) {
            return true;
        }
        return false;
    };

    /**
     * data
     */
    const codeGrp = {
        grpSeq,
        grpCd,
        cdNm,
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setGrpCd('');
        setCdNm('');
        onHide();
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (validate(codeGrp)) {
            onSave(codeGrp);
            handleHide();
        }
    };

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        if (codeGrp) {
            onDelete(codeGrp);
            handleHide();
        }
    };

    if (type === 'add') {
        return (
            <MokaModal
                width={600}
                size="md"
                draggable
                show={show}
                onHide={handleHide}
                title="그룹 등록"
                buttons={[
                    {
                        text: '등록',
                        variant: 'positive',
                        onClick: handleClickSave,
                    },
                ]}
                footerClassName="justify-content-center"
                centered
            >
                <MokaInputLabel
                    label="코드그룹"
                    placeholder="코드 그룹 아이디(영문으로 작성하세요)"
                    value={grpCd}
                    name="grpCd"
                    onChange={handleChangeValue}
                    isInvalid={grpCdError}
                    required
                />
                <MokaInputLabel label="코드그룹명" placeholder="코드그룹명" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} required />
            </MokaModal>
        );
    } else if (type === 'edit') {
        return (
            <MokaModal
                width={600}
                size="md"
                draggable
                show={show}
                onHide={handleHide}
                title="그룹 수정"
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
                ]}
                footerClassName="justify-content-center"
                centered
            >
                <MokaInputLabel label="코드그룹" placeholder="코드 그룹 아이디(영문으로 작성하세요)" value={grpCd} name="grpCd" onChange={handleChangeValue} disabled />
                <MokaInputLabel label="코드그룹명" placeholder="코드 그룹명" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={cdNmError} required />
            </MokaModal>
        );
    }
};

CodeMgtListModal.propTypes = propTypes;
CodeMgtListModal.defaultProps = defaultProps;

export default CodeMgtListModal;
