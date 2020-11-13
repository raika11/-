import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { MokaModal } from '@components';
import { getCodeServiceList, getCodeSectionList, getCodeContentList } from '@store/code';

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
    onCancel: PropTypes.func,
};
const defaultProps = {
    title: '',
};

/**
 * 기사 분류 코드 선택 모달
 */
const CodeListModal = (props) => {
    const { show, onHide, title, buttons, onOk, onCancel, ...rest } = props;

    const dispatch = useDispatch();
    const { serviceList, sectionList, contentList } = useSelector((store) => ({
        serviceList: store.code.service.list,
        sectionList: store.code.section.list,
        contentList: store.code.content.list,
    }));

    // 선택한 코드
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);

    // 대분류 리스트 조회
    useEffect(() => {
        dispatch(getCodeServiceList());
    }, [dispatch]);

    // 중분류 리스트 조회
    // useEffect(() => {
    //     setSCodeList([]);
    //     setSelectedContent(null);

    //     if (selectedService) {
    //         const regex = new RegExp(`(${selectedService.largeCodeId})\\d{2}(000)`);
    //         setMCodeList(codeList.resultInfo.body.list.list.filter((code) => regex.test(code.codeId) && code.middleCodeId !== '00'));
    //     } else {
    //         setMCodeList([]);
    //         setSelectedSection(null);
    //     }
    // }, [selectedService]);

    // // 소분류 리스트 조회
    // useEffect(() => {
    //     if (selectedSection) {
    //         const regex = new RegExp(`(${selectedSection.largeCodeId})${selectedSection.middleCodeId}\\d{3}`);
    //         setSCodeList(codeList.resultInfo.body.list.list.filter((code) => regex.test(code.codeId) && code.codeId.slice(-3) !== '000'));
    //     } else {
    //         setSCodeList([]);
    //         setSelectedContent(null);
    //     }
    // }, [selectedSection]);

    /**
     * 대분류 변경 시
     */
    const selectLCode = useCallback((codeData, e) => {
        setSelectedService(codeData);
    }, []);

    /**
     * 중분류 변경 시
     */
    const selectMCode = useCallback(
        (codeData, e) => {
            if (!selectedSection || selectedSection.codeId !== codeData.codeId) {
                setSelectedSection(codeData);
            } else {
                setSelectedSection(null);
                setSelectedContent(null);
                e.target.checked = false;
            }
        },
        [selectedSection],
    );

    /**
     * 소분류 변경 시
     */
    const selectSCode = useCallback(
        (codeData, e) => {
            if (!selectedContent || selectedContent.codeId !== codeData.codeId) {
                setSelectedContent(codeData);
            } else {
                setSelectedContent(null);
                e.target.checked = false;
            }
        },
        [selectedContent],
    );

    /**
     * 적용버튼 클릭
     */
    const handleOkTrigger = useCallback(() => {
        if (typeof onOk !== 'function') {
            return;
        }
        if (selectedContent) {
            onOk(selectedContent);
        } else if (selectedSection) {
            onOk(selectedSection);
        } else {
            onOk(selectedService);
        }
        onHide();
    }, [selectedService, selectedSection, selectedContent, onOk, onHide]);

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
                        {serviceList.map((code) => (
                            <ListGroup.Item key={code.codeId}>
                                <Form.Check custom type="radio" name="lcode" id={`radio-${code.masterCode}`} label={code.serviceKorname} onClick={(e) => selectLCode(code, e)} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* 중분류 */}
                <div>
                    <p className="h5">중분류</p>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {sectionList.map((code) => (
                            <ListGroup.Item key={code.codeId}>
                                <Form.Check custom type="radio" name="mcode" id={`radio-${code.masterCode}`} label={code.sectionKorname} onClick={(e) => selectMCode(code, e)} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* 소분류 */}
                <div>
                    <p className="h5">소분류</p>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {contentList.map((code) => (
                            <ListGroup.Item key={code.codeId}>
                                <Form.Check custom type="radio" name="scode" id={`radio-${code.masterCode}`} label={code.contentKorname} onClick={(e) => selectSCode(code, e)} />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </MokaModal>
    );
};

CodeListModal.propTypes = propTypes;
CodeListModal.defaultProps = defaultProps;

export default CodeListModal;
