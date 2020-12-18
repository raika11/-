import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { MokaModal, MokaInput, MokaIcon } from '@components';
import { getMasterCodeList, GET_MASTER_CODE_LIST, clearMasterCodeList } from '@store/code';

const propTypes = {
    /**
     * value
     */
    value: PropTypes.any,
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
    selection: 'multiple',
};

/**
 * 기사 분류 코드 선택 모달
 */
const CodeListModal = (props) => {
    const { show, onHide, title, onSave, onCancel, selection, value, ...rest } = props;
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
        setSelectedList([]);
    }, [onHide]);

    /**
     * selectedList에서 타겟 제거
     * @param {string} masterCode masterCode
     */
    const spliceList = useCallback(
        (masterCode) => {
            const idx = selectedList.findIndex((s) => s.masterCode === masterCode);
            setSelectedList(
                produce(selectedList, (draft) => {
                    draft.splice(idx, 1);
                }),
            );
        },
        [selectedList],
    );

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
                spliceList(id);
            }
        },
        [masterCodeList, selectedList, selection, spliceList],
    );

    /**
     * 저장
     */
    const handleOkTrigger = useCallback(() => {
        if (typeof onSave !== 'function') {
            return;
        }

        if (selectedList.length > 0) {
            if (selection === 'single') {
                onSave(selectedList[0]);
            } else {
                onSave(selectedList);
            }
        } else {
            onSave(null);
        }

        handleHide();
    }, [onSave, selectedList, handleHide, selection]);

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
        let ns = [];

        if (!value || value === null) {
            return;
        } else if (masterCodeList.length < 1) {
            return;
        } else if (typeof value === 'string') {
            // masterCode만 넘어온 경우
            ns = [masterCodeList.find((m) => m.masterCode === value)];
        } else if (Array.isArray(value)) {
            // object의 array인 경우
            ns = value.map((v) => masterCodeList.find((m) => m.masterCode === v.masterCode));
        } else if (typeof value === 'object') {
            // object가 넘어온 경우
            ns = masterCodeList.find((m) => m.masterCode === value.masterCode);
        }

        setSelectedList(ns);
    }, [masterCodeList, value]);

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
                <Form.Row className="mb-2">
                    <Col xs={8} className="p-0 pr-2">
                        <div className="w-100 h-100 border mb-0 p-1 h6">
                            {selectedList.map((s) => (
                                <Badge key={s.masterCode} className="mr-1 mb-1" variant="searching">
                                    {s.masterCode} {s.contentKorname || s.sectionKorname || s.serviceKorname}
                                    <MokaIcon iconName="fas-times" className="ml-1 cursor-pointer" onClick={() => spliceList(s.masterCode)} />
                                </Badge>
                            ))}
                        </div>
                    </Col>
                    <Col xs={4} className="p-0 d-flex align-items-end">
                        <Button variant="positive" className="mr-2" onClick={handleOkTrigger}>
                            등록
                        </Button>
                        <Button variant="negative" onClick={handleHide}>
                            취소
                        </Button>
                    </Col>
                </Form.Row>

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
