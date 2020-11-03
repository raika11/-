import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

import codeList from './code_data.json';
import MokaModal from './MokaModal';

const propTypes = {
    /**
     * show
     */
    show: PropTypes.bool.isRequired,
    /**
     * hide함수
     */
    onHide: PropTypes.func.isRequired,
    /**
     * Modal타이틀
     */
    title: PropTypes.string,
    /**
     * footer의 버튼
     */
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            variant: PropTypes.string,
            buttonName: PropTypes.string,
            onClick: PropTypes.func,
        }),
    ),
    /**
     * 적용 버튼 클릭이벤트
     */
    onOk: PropTypes.func,
    /**
     * 취소 버튼 클릭이벤트
     */
    onCancle: PropTypes.func,
};
const defaultProps = {
    title: '',
};

/**
 * 대/중/소 코드 선택 모달
 */
const MokaCodeListModal = (props) => {
    const { show, onHide, title, buttons, onOk, onCancle, ...rest } = props;

    // 대중소 분류 코드 리스트
    const [lCodeList, setLCodeList] = useState([]);
    const [mCodeList, setMCodeList] = useState([]);
    const [sCodeList, setSCodeList] = useState([]);

    // 선택한 코드
    const [selectedLCode, setSelectedLCode] = useState(null);
    const [selectedMCode, setSelectedMCode] = useState(null);
    const [selectedSCode, setSelectedSCode] = useState(null);

    // 대분류 리스트 조회
    useEffect(() => {
        setLCodeList(codeList.resultInfo.body.list.list.filter((code) => code.middleCodeId === '00'));
    }, []);

    // 중분류 리스트 조회
    useEffect(() => {
        setSCodeList([]);
        setSelectedSCode(null);

        if (selectedLCode) {
            const regex = new RegExp(`(${selectedLCode.largeCodeId})\\d{2}(000)`);
            setMCodeList(codeList.resultInfo.body.list.list.filter((code) => regex.test(code.codeId) && code.middleCodeId !== '00'));
        } else {
            setMCodeList([]);
            setSelectedMCode(null);
        }
    }, [selectedLCode]);

    // 소분류 리스트 조회
    useEffect(() => {
        if (selectedMCode) {
            const regex = new RegExp(`(${selectedMCode.largeCodeId})${selectedMCode.middleCodeId}\\d{3}`);
            setSCodeList(codeList.resultInfo.body.list.list.filter((code) => regex.test(code.codeId) && code.codeId.slice(-3) !== '000'));
        } else {
            setSCodeList([]);
            setSelectedSCode(null);
        }
    }, [selectedMCode]);

    /**
     * 대분류 변경 시
     */
    const selectLCode = useCallback((codeData, e) => {
        setSelectedLCode(codeData);
    }, []);

    /**
     * 중분류 변경 시
     */
    const selectMCode = useCallback(
        (codeData, e) => {
            if (!selectedMCode || selectedMCode.codeId !== codeData.codeId) {
                setSelectedMCode(codeData);
            } else {
                setSelectedMCode(null);
                setSelectedSCode(null);
                e.target.checked = false;
            }
        },
        [selectedMCode],
    );

    /**
     * 소분류 변경 시
     */
    const selectSCode = useCallback(
        (codeData, e) => {
            if (!selectedSCode || selectedSCode.codeId !== codeData.codeId) {
                setSelectedSCode(codeData);
            } else {
                setSelectedSCode(null);
                e.target.checked = false;
            }
        },
        [selectedSCode],
    );

    /**
     * 적용버튼 클릭
     */
    const handleOkTrigger = useCallback(() => {
        if (typeof onOk !== 'function') {
            return;
        }
        if (selectedSCode) {
            onOk(selectedSCode);
        } else if (selectedMCode) {
            onOk(selectedMCode);
        } else {
            onOk(selectedLCode);
        }
        onHide();
    }, [selectedLCode, selectedMCode, selectedSCode, onOk, onHide]);

    return (
        <MokaModal
            width={600}
            {...rest}
            show={show}
            onHide={onHide}
            title={title}
            size="lg"
            draggable
            className="code-modal"
            buttons={
                buttons || [
                    { variant: 'primary', text: '적용', onClick: handleOkTrigger },
                    { variant: 'warning', text: '취소', onClick: onHide },
                ]
            }
            centered
        >
            <div className="d-flex align-items-center justify-content-around">
                {/* 대분류 */}
                <div>
                    <p className="h5">대분류</p>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {lCodeList.map((code) => (
                            <ListGroup.Item key={code.codeId}>
                                <Form.Check custom type="radio" name="lcode" id={`radio-${code.codeId}`} label={code.codeName} onClick={(e) => selectLCode(code, e)} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* 중분류 */}
                <div>
                    <p className="h5">중분류</p>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {mCodeList.map((code) => (
                            <ListGroup.Item key={code.codeId}>
                                <Form.Check custom type="radio" name="mcode" id={`radio-${code.codeId}`} label={code.codeName} onClick={(e) => selectMCode(code, e)} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* 소분류 */}
                <div>
                    <p className="h5">소분류</p>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {sCodeList.map((code) => (
                            <ListGroup.Item key={code.codeId}>
                                <Form.Check custom type="radio" name="scode" id={`radio-${code.codeId}`} label={code.codeName} onClick={(e) => selectSCode(code, e)} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </MokaModal>
    );
};

MokaCodeListModal.propTypes = propTypes;
MokaCodeListModal.defaultProps = defaultProps;

export default MokaCodeListModal;
