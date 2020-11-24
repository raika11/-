import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup';
import { MokaModal, MokaInput } from '@components';
import {
    initialState,
    getCodeServiceList,
    getCodeSectionList,
    changeSectionSearchOption,
    getCodeContentList,
    changeContentSearchOption,
    clearServiceList,
    clearSectionList,
    clearContentList,
} from '@store/code';

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
    onSave: PropTypes.func,
    /**
     * 취소 버튼 클릭이벤트
     */
    onCancel: PropTypes.func,
};
const defaultProps = {
    title: '기사분류 선택',
};

/**
 * 기사 분류 코드 선택 모달
 */
const CodeListModal = (props) => {
    const { show, onHide, title, buttons, onSave, onCancel, ...rest } = props;

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

    /**
     * 대분류 변경 시
     */
    const selectServiceCode = useCallback((codeData, e) => {
        setSelectedService(codeData);
    }, []);

    /**
     * 중분류 변경 시
     */
    const selectSectionCode = useCallback(
        (codeData, e) => {
            if (!selectedSection || selectedSection.masterCode !== codeData.masterCode) {
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
    const selectContentCode = useCallback(
        (codeData, e) => {
            if (!selectedContent || selectedContent.masterCode !== codeData.masterCode) {
                setSelectedContent(codeData);
            } else {
                setSelectedContent(null);
                e.target.checked = false;
            }
        },
        [selectedContent],
    );

    /**
     *  닫기
     */
    const handleHide = useCallback(() => {
        // dispatch(clearServiceList());
        // dispatch(clearSectionList());
        // dispatch(clearContentList());

        if (onHide) {
            onHide();
        }
    }, [onHide]);

    /**
     * 적용버튼 클릭
     */
    const handleOkTrigger = useCallback(() => {
        if (typeof onSave !== 'function') {
            return;
        }
        if (selectedContent) {
            onSave(selectedContent);
        } else if (selectedSection) {
            onSave(selectedSection);
        } else {
            onSave(selectedService);
        }

        handleHide();
    }, [selectedService, selectedSection, selectedContent, onSave, handleHide]);

    useEffect(() => {
        // 대분류 리스트 조회
        if (show) {
            dispatch(getCodeServiceList());
        }
    }, [dispatch, show]);

    useEffect(() => {
        // 중분류 리스트 조회
        setSelectedSection(null);
        setSelectedContent(null);
        dispatch(clearContentList());

        if (selectedService) {
            dispatch(
                getCodeSectionList(
                    changeSectionSearchOption({
                        ...initialState.section.search,
                        keyword: selectedService.masterCode.slice(0, 2),
                    }),
                ),
            );
        } else {
            dispatch(clearSectionList());
        }
    }, [dispatch, selectedService]);

    useEffect(() => {
        // 소분류 리스트 조회
        setSelectedContent(null);

        if (selectedSection) {
            dispatch(
                getCodeContentList(
                    changeContentSearchOption({
                        ...initialState.content.search,
                        keyword: selectedSection.masterCode.slice(0, 4),
                    }),
                ),
            );
        } else {
            dispatch(clearContentList());
        }
    }, [dispatch, selectedSection]);

    useEffect(() => {
        return () => {
            dispatch(clearServiceList());
            dispatch(clearSectionList());
            dispatch(clearContentList());
        };
    }, [dispatch]);

    return (
        <MokaModal
            width={600}
            {...rest}
            show={show}
            onHide={handleHide}
            title={title}
            size="lg"
            draggable
            className="code-modal"
            footerClassName="d-flex justify-content-center"
            buttons={buttons || [{ variant: 'positive', text: '적용', onClick: handleOkTrigger }]}
            centered
        >
            <div className="d-flex align-items-center justify-content-around">
                {/* 대분류 */}
                <div className="border mr-2" style={{ width: 200 }}>
                    <div className="p-3 d-flex align-items-center justify-content-center border-bottom">
                        <p className="mb-0 h5">대분류</p>
                    </div>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {serviceList.map((code) => (
                            <ListGroup.Item key={code.masterCode}>
                                <MokaInput
                                    as="radio"
                                    name="lcode"
                                    id={`radio-${code.masterCode}`}
                                    inputProps={{ label: code.serviceKorname, custom: true }}
                                    onClick={(e) => selectServiceCode(code, e)}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* 중분류 */}
                <div className="border mr-2" style={{ width: 200 }}>
                    <div className="p-3 d-flex align-items-center justify-content-center border-bottom">
                        <p className="mb-0 h5">중분류</p>
                    </div>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {sectionList.map((code) => (
                            <ListGroup.Item key={code.masterCode}>
                                <MokaInput
                                    as="radio"
                                    name="mcode"
                                    id={`radio-${code.sectionKorname}`}
                                    inputProps={{ label: code.sectionKorname, custom: true }}
                                    onClick={(e) => selectSectionCode(code, e)}
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* 소분류 */}
                <div className="border" style={{ width: 200 }}>
                    <div className="p-3 d-flex align-items-center justify-content-center border-bottom">
                        <p className="mb-0 h5">소분류</p>
                    </div>
                    <ListGroup variant="flush" className="custom-scroll" style={{ height: 360 }}>
                        {contentList.map((code) => (
                            <ListGroup.Item key={code.masterCode}>
                                <MokaInput
                                    as="radio"
                                    name="scode"
                                    id={`radio-${code.contentKorname}`}
                                    inputProps={{ label: code.contentKorname, custom: true }}
                                    onClick={(e) => selectContentCode(code, e)}
                                />
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
