import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaModal, MokaInput } from '@components';
import { getMasterCodeList, GET_MASTER_CODE_LIST, clearMasterCodeList } from '@store/code';

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
     * 단일 선택(라디오버튼) / 멀티 선택(체크박스)
     */
    selection: PropTypes.oneOf(['single', 'multiple']),
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
    title: '분류코드표',
    selection: 'single',
};

/**
 * 기사 분류 코드 선택 모달
 */
const CodeListModal = (props) => {
    const { show, onHide, title, onSave, onCancel, selection, ...rest } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_MASTER_CODE_LIST]);
    const masterCodeList = useSelector((store) => store.code.master.list);

    const [serviceList, setServiceList] = useState([]); // 1뎁스
    const [sectionList, setSectionList] = useState([]); // 2뎁스
    const [contentList, setContentList] = useState([]); // 3뎁스
    const [selectedList, setSelectedList] = useState([]); // 선택한 코드

    /**
     *  닫기
     */
    const handleHide = useCallback(() => {
        if (onHide) {
            onHide();
        }
    }, [onHide]);

    /**
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { checked, id } = e.target;
            const origin = masterCodeList.find((m) => m.masterCode === id);

            if (checked) {
                // single, multiple 분기
                if (selection === 'single') {
                    setSelectedList([origin]);
                } else {
                    setSelectedList(
                        produce(selectedList, (draft) => {
                            draft.push(origin);
                        }),
                    );
                }
            } else {
                const idx = selectedList.findIndex((s) => s.masterCode === id);
                setSelectedList(
                    produce(selectedList, (draft) => {
                        draft.splice(idx, 1);
                    }),
                );
            }
        },
        [masterCodeList, selectedList, selection],
    );

    /**
     * 적용버튼 클릭
     */
    // const handleOkTrigger = useCallback(() => {
    //     if (typeof onSave !== 'function') {
    //         return;
    //     }
    //     if (selectedContent) {
    //         onSave(selectedContent);
    //     } else if (selectedSection) {
    //         onSave(selectedSection);
    //     } else {
    //         onSave(selectedService);
    //     }

    //     handleHide();
    // }, [onSave, handleHide]);

    useEffect(() => {
        // 마스터코드 조회
        if (show) {
            dispatch(getMasterCodeList());
        }
    }, [dispatch, show]);

    useEffect(() => {
        // 마스터코드 파싱
        let svl = [],
            scl = [],
            cnl = [];

        masterCodeList.forEach((element) => {
            if (element.masterCode.slice(-5) === '00000') {
                svl.push(element);
            } else if (element.masterCode.slice(-3) === '000') {
                scl.push(element);
            } else {
                cnl.push(element);
            }
        });

        setServiceList(svl);
        setSectionList(scl);
        setContentList(cnl);
    }, [masterCodeList]);

    useEffect(() => {
        return () => {
            dispatch(clearMasterCodeList());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaModal width={900} {...rest} show={show} onHide={handleHide} title={title} size="lg" draggable bodyClassName="code-modal" loading={loading} centered>
            <div className="d-flex flex-column">
                {/* 분류명, 분류코드 노출, 등록, 취소 버튼 */}
                <div className="d-flex align-items-center mb-3">
                    <div className="border">태그 들어갈 자리</div>
                    <Button variant="positive">등록</Button>
                    <Button variant="negative">취소</Button>
                </div>

                {/* 분류 테이블 */}
                <Form.Row className="flex-wrap border flex-fill custom-scroll" style={{ height: 400 }}>
                    {serviceList.map((dep1, idx) => (
                        <Col xs={6} key={dep1.masterCode} className={clsx('service p-0 border-bottom', { 'border-right': idx % 2 === 0 })}>
                            {/* 대분류 */}
                            <div className={clsx('d-flex align-items-center justify-content-center border-bottom')} style={{ height: 50 }}>
                                <MokaInput
                                    as={selection === 'single' ? 'radio' : 'checkbox'}
                                    name="masterCode"
                                    className="flex-grow-0 mt-1 h5 mb-0"
                                    id={dep1.masterCode}
                                    inputProps={{ custom: true, label: dep1.serviceKorname, checked: selectedList.findIndex((s) => s.masterCode === dep1.masterCode) > -1 }}
                                    onChange={handleChangeValue}
                                />
                            </div>
                            <Form.Row className={clsx('section d-flex flex-wrap align-items-start')}>
                                {sectionList.map((dep2) => {
                                    if (dep2.masterCode.startsWith(dep1.masterCode.slice(0, 2))) {
                                        return (
                                            <div key={dep2.masterCode} className="d-flex h-100 w-100 border-bottom">
                                                {/* 중분류 */}
                                                <Col xs={4} className="p-3 h-auto border-right">
                                                    <div className="d-flex align-items-center">
                                                        <MokaInput
                                                            as={selection === 'single' ? 'radio' : 'checkbox'}
                                                            name="masterCode"
                                                            className="flex-grow-0"
                                                            id={dep2.masterCode}
                                                            inputProps={{
                                                                custom: true,
                                                                label: dep2.sectionKorname,
                                                                checked: selectedList.findIndex((s) => s.masterCode === dep2.masterCode) > -1,
                                                            }}
                                                            onChange={handleChangeValue}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col xs={8} className="d-flex flex-wrap pt-3 pl-2 pb-0">
                                                    {/* 소분류 */}
                                                    {contentList.map((dep3) => {
                                                        if (dep3.masterCode.startsWith(dep2.masterCode.slice(0, 4))) {
                                                            return (
                                                                <div key={dep3.masterCode} className="d-flex align-items-center ml-10 mb-10">
                                                                    <MokaInput
                                                                        as={selection === 'single' ? 'radio' : 'checkbox'}
                                                                        name="masterCode"
                                                                        className="flex-grow-0"
                                                                        id={dep3.masterCode}
                                                                        inputProps={{
                                                                            custom: true,
                                                                            label: dep3.contentKorname,
                                                                            checked: selectedList.findIndex((s) => s.masterCode === dep3.masterCode) > -1,
                                                                        }}
                                                                        onChange={handleChangeValue}
                                                                    />
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    })}
                                                </Col>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </Form.Row>
                        </Col>
                    ))}
                </Form.Row>
            </div>
        </MokaModal>
    );
};

CodeListModal.propTypes = propTypes;
CodeListModal.defaultProps = defaultProps;

export default CodeListModal;
