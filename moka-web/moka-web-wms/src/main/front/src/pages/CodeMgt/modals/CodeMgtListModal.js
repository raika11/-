import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { MokaModal, MokaInputLabel } from '@components';
import { changeInvalidList } from '@store/codeMgt';

const propTypes = {
    /**
     * type 모달 type
     */
    type: PropTypes.string,
};
const defaultProps = {
    type: '',
};

/**
 * 기타코드 리스트 모달 컴포넌트
 */
const CodeMgtListModal = (props) => {
    const { show, onHide, type, onSave, onDelete, data } = props;
    const dispatch = useDispatch();
    const invalidList = useSelector((store) => store.codeMgt.invalidList);

    // modal 항목 state
    const [grpSeq, setGrpSeq] = useState('');
    const [grpCd, setGrpCd] = useState('');
    const [cdNm, setCdNm] = useState('');
    const [error, setError] = useState({});

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
     * @param {object} obj
     */
    const validate = (obj) => {
        let isInvalid = false;
        let errList = [];

        if (!/^[A-Za-z0-9_-`/]+$/g.test(obj.grpCd) || obj.grpCd.length > 12) {
            errList.push({
                field: 'grpCd',
                reason: '코드 그룹 아이디를 확인해주세요',
            });
            isInvalid = isInvalid || true;
        }
        if (!/[^\s\t\n]+/g.test(obj.cdNm)) {
            errList.push({
                field: 'cdNm',
                reason: '코드 그룹명을 확인해주세요',
            });
            isInvalid = isInvalid || true;
        }
        dispatch(changeInvalidList(errList));

        return !isInvalid;
    };

    /**
     * 모달 닫기
     */
    const handleHide = () => {
        setGrpCd('');
        setCdNm('');
        setError(false);
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

    useEffect(() => {
        // invalidList 처리
        if (invalidList.length > 0) {
            setError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
        }
    }, [invalidList]);

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
                    placeholder="코드 그룹 아이디는 12자리 이하의 영문으로 작성하세요"
                    value={grpCd}
                    name="grpCd"
                    onChange={handleChangeValue}
                    isInvalid={error.grpCd}
                    required
                />
                <MokaInputLabel label="코드그룹명" placeholder="코드그룹명" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={error.cdNm} required />
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
                <MokaInputLabel label="코드그룹" value={grpCd} name="grpCd" onChange={handleChangeValue} disabled />
                <MokaInputLabel label="코드그룹명" placeholder="코드 그룹명" value={cdNm} name="cdNm" onChange={handleChangeValue} isInvalid={error.cdNm} required />
            </MokaModal>
        );
    }
};

CodeMgtListModal.propTypes = propTypes;
CodeMgtListModal.defaultProps = defaultProps;

export default CodeMgtListModal;
