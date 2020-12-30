import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import { MokaModal, MokaInput, MokaIcon, useBreakpoint } from '@components';
import { getMasterCodeList, GET_MASTER_CODE_LIST, clearMasterCodeList } from '@store/code';
import toast from '@utils/toastUtil';

const propTypes = {
    /**
     * value (string | array | object)
     * string => 1110000 마스터코드
     * array => [1110000, 1110001]처럼 string 마스터코드의 배열
     * object => { masterCode: 1110000 }처럼 마스터코드를 가진 오브젝트 1개
     */
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string, PropTypes.object]),
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
     * 저장 버튼 클릭이벤트
     */
    onSave: PropTypes.func,
    /**
     * 취소 버튼 클릭이벤트
     */
    onCancel: PropTypes.func,
    /**
     * 선택가능한 마스터코드의 최대 갯수
     */
    max: PropTypes.number,
};
const defaultProps = {
    title: '분류코드표',
    selection: 'single',
};

/**
 * 기사 분류(masterCode) 코드 선택 모달
 */
const CodeListModal = (props) => {
    const { show, onHide, title, onSave, onCancel, selection, value, max, ...rest } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_MASTER_CODE_LIST]);
    const masterCodeList = useSelector((store) => store.code.master.list);
    const matchPoints = useBreakpoint();

    const [serviceList, setServiceList] = useState([]); // 1뎁스 = 대분류 = 서비스코드
    const [sectionList, setSectionList] = useState([]); // 2뎁스 = 중분류 = 섹션코드
    const [contentObj, setContentObj] = useState({}); // 3뎁스 = 소분류 = 컨텐츠코드
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
     * 초기화
     */
    const handleReset = useCallback(() => {
        // selectedList 제거
        setSelectedList([]);
    }, []);

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
                    // selectedList.lenght가 max보다 크면 waning 노출
                    if (max) {
                        if (selectedList.length >= max) {
                            toast.warning(`최대 ${max}개까지 선택할 수 있습니다.`);
                            return;
                        }
                    }
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
        [masterCodeList, max, selectedList, selection, spliceList],
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

        // 렌더링하기 위해 소분류 데이터 파싱
        let key = null;
        const co = cnl.reduce((all, current) => {
            const parentCode = current.masterCode.slice(0, 4);
            if (key !== parentCode) {
                all[parentCode] = [current];
                key = parentCode;
            } else {
                all[parentCode].push(current);
            }
            return all;
        }, {});

        setServiceList(svl);
        setSectionList(scl);
        setContentObj(co);
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
            // masterCode의 array가 넘어온 경우
            ns = value.map((v) => masterCodeList.find((m) => m.masterCode === v));
        } else if (typeof value === 'object') {
            // object가 넘어온 경우
            ns = [masterCodeList.find((m) => m.masterCode === value.masterCode)];
        }

        ns = ns.filter((s) => s);
        setSelectedList(ns);
    }, [masterCodeList, value]);

    useEffect(() => {
        return () => {
            dispatch(clearMasterCodeList());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaModal
            width={1200}
            height={800}
            {...rest}
            show={show}
            onHide={handleHide}
            title={title}
            size="xl"
            draggable
            bodyClassName="code-modal h-100"
            loading={loading}
            centered
        >
            <div className="d-flex flex-column h-100">
                {/* 분류명, 분류코드 노출, 저장, 초기화 버튼 */}
                <div>
                    <Form.Row className="flex-wrap">
                        <Col sm={10} className="p-0">
                            <div className="w-100 mb-0 h6">
                                {selectedList.map((s) => (
                                    <Badge key={s.masterCode} className="mr-1 mb-1 user-select-text" variant="searching">
                                        {s.masterCode}&nbsp;
                                        {s.masterCode.slice(-5) === '00000' ? s.serviceKorname : s.masterCode.slice(-3) === '000' ? s.sectionKorname : s.contentKorname}
                                        <MokaIcon iconName="fas-times" className="ml-1 cursor-pointer" onClick={() => spliceList(s.masterCode)} />
                                    </Badge>
                                ))}
                            </div>
                        </Col>
                        <Col sm={2} className="p-0 d-flex align-items-end mb-2">
                            <Button variant="positive" className="mr-2 flex-fill" onClick={handleOkTrigger}>
                                저장
                            </Button>
                            <Button variant="negative" className="flex-fill" onClick={handleReset}>
                                초기화
                            </Button>
                        </Col>
                    </Form.Row>
                </div>

                {/* 분류 테이블 */}
                <div className="border d-flex flex-fill flex-wrap custom-scroll">
                    {serviceList.map((dep1, idx) => (
                        <Col
                            md={4}
                            sm={6}
                            key={dep1.masterCode}
                            className={clsx('service d-flex flex-column p-0 border-bottom', {
                                'border-right': (matchPoints.sm && idx % 2 === 0) || (matchPoints.md && idx % 3 !== 2) || (matchPoints.lg && idx % 3 !== 2),
                            })}
                        >
                            {/* 대분류 */}
                            <div
                                className={clsx('d-flex align-items-center justify-content-center border-bottom')}
                                style={{ height: 34, backgroundColor: 'rgb(123 188 222 / 0.1)' }}
                            >
                                <MokaInput
                                    as={selection === 'single' ? 'radio' : 'checkbox'}
                                    name="masterCode"
                                    className="flex-grow-0 text-dark font-weight-bold mb-0 ft-12"
                                    id={dep1.masterCode}
                                    inputProps={{ custom: true, label: dep1.serviceKorname, checked: selectedList.findIndex((s) => s.masterCode === dep1.masterCode) > -1 }}
                                    onChange={handleChangeValue}
                                />
                            </div>
                            <div className={clsx('section flex-fill d-flex flex-column align-items-start')} style={{ minHeight: 0 }}>
                                {Object.keys(contentObj).map((contentKey) => {
                                    if (!contentKey.startsWith(dep1.masterCode.slice(0, 2))) {
                                        return null;
                                    }

                                    let dep2 = sectionList.find((section) => section.masterCode.startsWith(contentKey));
                                    let exist = true;
                                    if (!dep2) {
                                        dep2 = contentObj[contentKey][0];
                                        exist = false;
                                    }

                                    return (
                                        <div key={contentKey} className="d-flex w-100 border-bottom">
                                            {/* 중분류 */}
                                            <Col xs={3} className="p-2 h-auto border-right" style={{ backgroundColor: 'rgb(189 180 142 / 10%)' }}>
                                                {exist ? (
                                                    <MokaInput
                                                        as={selection === 'single' ? 'radio' : 'checkbox'}
                                                        name="masterCode"
                                                        className="flex-grow-0 ft-12"
                                                        id={dep2.masterCode}
                                                        inputProps={{
                                                            custom: true,
                                                            label: dep2.sectionKorname,
                                                            checked: selectedList.findIndex((s) => s.masterCode === dep2.masterCode) > -1,
                                                        }}
                                                        onChange={handleChangeValue}
                                                    />
                                                ) : (
                                                    <p className="mb-0 ft-12">dep2.sectionKorname</p>
                                                )}
                                            </Col>
                                            <Col xs={9} className="pt-1 pr-1 pl-1 pb-0">
                                                {/* 소분류 */}
                                                {contentObj[contentKey].map((dep3) => {
                                                    return (
                                                        <div key={dep3.masterCode} className="float-left ml-1 mb-1">
                                                            <MokaInput
                                                                as={selection === 'single' ? 'radio' : 'checkbox'}
                                                                name="masterCode"
                                                                className="flex-grow-0 ft-12"
                                                                id={dep3.masterCode}
                                                                inputProps={{
                                                                    custom: true,
                                                                    label: `[${dep3.masterCode}] ${dep3.contentKorname}`,
                                                                    checked: selectedList.findIndex((s) => s.masterCode === dep3.masterCode) > -1,
                                                                }}
                                                                onChange={handleChangeValue}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </Col>
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                    ))}
                </div>
            </div>
        </MokaModal>
    );
};

CodeListModal.propTypes = propTypes;
CodeListModal.defaultProps = defaultProps;

export default CodeListModal;
