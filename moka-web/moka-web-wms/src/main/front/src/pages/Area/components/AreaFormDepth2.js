import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { ITEM_CP, ITEM_CT, AREA_COMP_ALIGN_LEFT, AREA_ALIGN_V, AREA_ALIGN_H } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput, MokaIcon } from '@components';
import { MokaEditorCore } from '@components/MokaEditor';
import { initialState, SAVE_AREA, DELETE_AREA, GET_AREA_MODAL, saveArea, changeInvalidList } from '@store/area';
import { initialState as componentState, getComponentListModal } from '@store/component';
import { initialState as containerState, getContainerListModal } from '@store/container';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import util from '@utils/commonUtil';
import ComponentSelector from './ComponentSelector';
import ContainerSelector from './ContainerSelector';
import AreaComp from './AreaComp';
import ComponentLoadBox from './ComponentLoadBox';
import ContainerLoadBox from './ContainerLoadBox';
import ResourcePopover from './ResourcePopover';

/**
 * 편집영역 2뎁스 폼
 */
const AreaFormDepth2 = (props) => {
    const {
        setModalShow, // 페이지 선택 모달
        setModalDomainId,
        page,
        setPage,
        depth,
        onDelete,
        child,
        parent,
        area,
        setFlag,
        flag,
        sourceCode,
        setAreaDepth2,
        list,
    } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[SAVE_AREA] || loading[DELETE_AREA] || loading[GET_AREA_MODAL]);
    const { invalidList } = useSelector(({ area }) => area);
    const [temp, setTemp] = useState(initialState.initData.area); // 수정가능한 데이터
    const [previewRsrc, setPreviewRsrc] = useState(''); // 미리보기 리소스
    const [domain, setDomain] = useState({}); // 도메인
    const [container, setContainer] = useState({}); // 선택한 컨테이너 담고 있는 state
    const [component, setComponent] = useState({}); // 선택한 컴포넌트 담고 있는 state
    const [areaComp, setAreaComp] = useState({}); // areaDiv === ITEM_CP 일 때 areaComp 1개
    const [areaComps, setAreaComps] = useState([]); // areaDiv === ITEM_CT 일 때 DB에 저장되는 areaComp 리스트
    const [areaCompLoad, setAreaCompLoad] = useState(initialState.initData.areaCompLoad);
    const [loadCnt, setLoadCnt] = useState(0);
    const [contOptions, setContOptions] = useState([]); // 컨테이너 options
    const [compOptions, setCompOptions] = useState([]); // 컴포넌트 options
    const [error, setError] = useState({}); // 에러

    /**
     * validate
     * @param {object} saveObj area data
     */
    const validate = (saveObj) => {
        let isInvalid = false;
        let errList = [];
        const isCmp = saveObj.compYn === 'Y';

        // 영역명 체크
        if (util.isEmpty(saveObj.areaNm)) {
            errList.push({
                field: 'areaNm',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }
        // 페이지 체크
        if (isCmp && !saveObj.page?.pageSeq) {
            errList.push({
                field: 'page',
                reason: '페이지를 선택하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 부모 체크
        if (!saveObj.parent?.areaSeq) {
            errList.push({
                field: 'parent',
                reason: '상위 영역을 선택하세요',
            });
            isInvalid = isInvalid || true;
        }
        // areaComp, areaComps 체크
        if (isCmp && saveObj.areaDiv === ITEM_CP) {
            if (!saveObj.areaComp.component?.componentSeq) {
                errList.push({
                    field: 'component',
                    reason: '선택된 컴포넌트가 없습니다',
                });
                isInvalid = isInvalid || true;
            }
        } else if (isCmp && !saveObj.container?.containerSeq) {
            errList.push({
                field: 'container',
                reason: '선택된 컨테이너가 없습니다',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장
     * @param {object} save area 데이터
     */
    const handleSave = (save) => {
        dispatch(
            saveArea({
                area: save,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        setFlag({ ...flag, depth2: new Date().getTime(), depth3: new Date().getTime() });
                        setAreaDepth2(body);
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        // areaCompLoad 체크
        if (areaCompLoad.byContainer) {
            messageBox.alert(areaCompLoad.byContainerMessage);
            return;
        } else if (areaCompLoad.byPage) {
            messageBox.alert(areaCompLoad.byPageMessage);
            return;
        } else if (areaCompLoad.byContainerComp) {
            messageBox.alert(areaCompLoad.byContainerCompMessage);
            return;
        }

        const isCmp = temp.compYn === 'Y';

        let save = {
            ...temp,
            depth, // depth 변경
            ordNo: temp.areaSeq ? temp.ordNo : list.length + 1, // 수정 등록 분기쳐서 ordNo 셋팅
            sourceCode,
            domain,
            page: isCmp ? { pageSeq: page.pageSeq, pageName: page.pageName, pageUrl: page.pageUrl } : null,
            parent: { areaSeq: parent.areaSeq },
            previewRsrc: isCmp ? previewRsrc : null,
        };
        if (isCmp && temp.areaDiv === ITEM_CP) {
            save.container = null;
            save.areaComps = null;
            save.areaComp = { ...areaComp, component, ordNo: 1 };
        } else if (isCmp) {
            save.container = container;
            save.areaComp = null;
            save.areaComps = areaComps;
        } else {
            save.container = null;
            save.areaComp = null;
            save.areaComps = null;
        }

        if (validate(save)) {
            if (child.length > 0 && save.usedYn === 'N') {
                messageBox.confirm(
                    '하위 뎁스 메뉴도 편집 영역에 노출되지 않습니다.\n사용여부를 off 하시겠습니까?',
                    () => handleSave(save),
                    () => {},
                );
            } else {
                handleSave(save);
            }
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => onDelete(temp, depth);

    /**
     * 컨테이너의 컴포넌트 목록 조회
     */
    const handleCompLoad = useCallback(
        (cont) => {
            if (cont && cont.containerSeq) {
                dispatch(
                    getComponentListModal({
                        search: {
                            ...componentState.search,
                            usePaging: 'N',
                            useArea: 'Y',
                            searchType: 'containerSeq',
                            keyword: cont.containerSeq,
                            domainId: page.domain?.domainId,
                        },
                        callback: ({ body }) => {
                            setAreaComps(
                                body.list.map((b) => {
                                    // 원본 데이터의 deskingPart를 셋팅
                                    let deskingPart = null;
                                    if (area.area?.areaComps?.length > 0) {
                                        const tgt = area.area.areaComps.find((o) => o.component !== null && o.component?.componentSeq === b.componentSeq);
                                        deskingPart = tgt?.deskingPart;
                                    }

                                    return {
                                        compAlign: AREA_COMP_ALIGN_LEFT,
                                        component: { ...b },
                                        ordNo: b.relOrd + 1,
                                        deskingPart,
                                    };
                                }),
                            );
                            setAreaCompLoad({
                                ...areaCompLoad,
                                byContainerComp: false,
                                byContainerCompMessage: null,
                            });
                        },
                    }),
                );
            } else {
                // 컨테이너는 데이터가 없을 수가 있어서 컨테이너가 없을 때는 빈 리스트로 초기화
                setAreaComps([]);
                setAreaCompLoad({
                    ...areaCompLoad,
                    byContainerComp: false,
                    byContainerCompMessage: null,
                });
            }
        },
        [areaCompLoad, dispatch, area, page.domain],
    );

    /**
     * 페이지의 컴포넌트 options 조회
     */
    const getCompOptions = useCallback(
        (reload) => {
            setAreaComps([]);
            dispatch(
                getComponentListModal({
                    search: {
                        ...componentState.search,
                        usePaging: 'N',
                        useArea: 'Y',
                        searchType: 'pageSeq',
                        keyword: page?.pageSeq,
                        domainId: domain?.domainId,
                    },
                    callback: ({ body }) => {
                        setCompOptions(body.list || []);
                        setLoadCnt(1);
                        if (reload) {
                            setAreaCompLoad({
                                ...areaCompLoad,
                                byPage: false,
                                byPageMessage: null,
                            });
                            setAreaComp({});
                            setAreaComps([]);
                            setComponent({});
                            setContainer({});
                        }
                    },
                }),
            );
        },
        [dispatch, page.pageSeq, domain.domainId, areaCompLoad],
    );

    /**
     * 페이지의 컨테이너 options 조회
     */
    const getContOptions = useCallback(
        (reload) => {
            setComponent({});

            dispatch(
                getContainerListModal({
                    search: {
                        ...containerState.search,
                        usePaging: 'N',
                        searchType: 'pageSeq',
                        keyword: page?.pageSeq,
                        domainId: domain?.domainId,
                    },
                    callback: ({ body }) => {
                        setContOptions(body.list || []);
                        setLoadCnt(1);
                        if (reload) {
                            setAreaCompLoad({
                                ...areaCompLoad,
                                byContainer: false,
                                byContainerMessage: null,
                            });
                            setAreaComp({});
                            setAreaComps([]);
                            setComponent({});
                            setContainer({});
                        }
                    },
                }),
            );
        },
        [dispatch, page.pageSeq, domain.domainId, areaCompLoad],
    );

    /**
     * 입력값 변경
     * @param {object} e 이벤트객체
     * @param {number} index
     */
    const handleChangeValue = useCallback(
        (e, idx) => {
            const { name, value, checked, selectedOptions } = e.target;

            if (name === 'usedYn') {
                setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
            } else if (name === 'compYn') {
                setTemp({ ...temp, compYn: checked ? 'Y' : 'N' });
            } else if (name === 'areaDiv') {
                setTemp({ ...temp, areaDiv: value });
                setAreaComps([]);
                setAreaComp({});
            } else if (name === 'component') {
                // ComponentSelector에서 option이 변경될 때 (areaComps를 제거하고, areaComp의 deskingPart를 초기화)
                const { datatype } = selectedOptions[0].dataset;
                setComponent({ componentSeq: value, dataType: datatype });
                setAreaComps([]);
                setAreaComp({ ...areaComp, deskingPart: null });
                setError({ ...error, component: false });
            } else if (name === 'container') {
                // ContainerSelector에서 option이 변경될 때
                setContainer({ containerSeq: value });
                handleCompLoad({ containerSeq: value });
                setError({ ...error, container: false });
            } else if (name === 'compAlign') {
                const newComps = produce(areaComps, (draft) => {
                    draft.splice(idx, 1, {
                        ...areaComps[idx],
                        compAlign: value,
                    });
                });
                setAreaComps(newComps);
            } else {
                setTemp({ ...temp, [name]: value });
            }
        },
        [areaComp, areaComps, error, handleCompLoad, temp],
    );

    /**
     * 초기화
     */
    const setInit = useCallback(() => {
        setTemp(initialState.initData.area);
        setAreaCompLoad(initialState.initData.areaCompLoad);
        setPreviewRsrc('');
        setAreaComp({});
        setAreaComps([]);
        setComponent({});
        setContainer({});
        setPage({});
        setLoadCnt(0);
        setError({});
        setCompOptions([]);
        setContOptions([]);
    }, [setPage]);

    useEffect(() => {
        return () => {
            setInit();
        };
    }, [setInit]);

    useEffect(() => {
        // 데이터 셋팅
        const ar = area.area || initialState.initData.area;
        const ac = ar.areaComp || {};
        const acs = ar.areaComps || [];
        setTemp(ar);
        setAreaCompLoad(area.areaCompLoad || initialState.initData.areaCompLoad);
        setPreviewRsrc(ar.previewRsrc);
        setAreaComp(ac);
        setAreaComps(acs);
        setComponent(ac.component || {});
        setContainer(ar.container || {});
        setDomain(parent?.domain);
        setPage(ar.page);
        setLoadCnt(0);
        setError({});
    }, [area, parent, setPage]);

    useEffect(() => {
        if (domain.domainId) {
            setModalDomainId(domain.domainId);
        }
    }, [domain, setModalDomainId]);

    useEffect(() => {
        // 모달한테 전달받은 page,pageSeq 변경 시, areaDiv 변경 시, 선택한 폼 변경 시 CP, CT 리스트 조회
        if (page.pageSeq && temp.areaDiv) {
            setError({ ...error, page: false, component: false, container: false });
            temp.areaDiv === ITEM_CP ? getCompOptions(loadCnt !== 0) : getContOptions(loadCnt !== 0);
        } else {
            setCompOptions([]);
            setContOptions([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, temp.areaDiv, depth]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    return (
        <MokaCard
            title={`편집영역 ${temp.areaSeq ? '수정' : '등록'}`}
            className="flex-fill"
            loading={loading}
            footer
            footerButtons={[
                {
                    text: temp.areaSeq ? '수정' : '저장',
                    variant: 'positive',
                    className: 'mr-1',
                    onClick: handleClickSave,
                },
                temp.areaSeq && {
                    text: '삭제',
                    variant: 'negative',
                    onClick: handleClickDelete,
                },
            ].filter(Boolean)}
        >
            <div>
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        as="switch"
                        id="usedYn"
                        name="usedYn"
                        label="사용여부"
                        className="mb-0"
                        inputProps={{ checked: temp.usedYn === 'Y' }}
                        onChange={handleChangeValue}
                    />
                </Form.Row>

                {/* 부모 정보 노출 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="p-0 pr-40">
                        <MokaInputLabel name="parent" label="그룹 영역" value={parent.areaNm} onChange={handleChangeValue} disabled />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                    </Col>
                </Form.Row>

                {/* 도메인 */}
                <MokaInputLabel className="mb-2" label="도메인" value={domain.domainUrl} disabled />

                {/* 영역명 */}
                <MokaInputLabel className="mb-2" label="영역명" name="areaNm" value={temp.areaNm} onChange={handleChangeValue} isInvalid={error.areaNm} required />

                <hr className="divider" />

                {/* compYn 변경 */}
                <MokaInputLabel
                    as="switch"
                    className="mb-2"
                    label="편집 여부"
                    name="compYn"
                    id="compYn"
                    inputProps={{ custom: true, checked: temp.compYn === 'Y' }}
                    onChange={handleChangeValue}
                />

                {temp.compYn === 'Y' && (
                    <React.Fragment>
                        {/* 페이지 검색 */}
                        <Form.Row className="mb-2">
                            <MokaInputLabel as="none" className="mb-0" label="페이지" required />
                            <MokaSearchInput
                                className="w-100"
                                inputClassName="bg-white"
                                variant="dark"
                                value={page.pageSeq ? `${page.pageName} (${page.pageUrl})` : ''}
                                onSearch={() => setModalShow(true)}
                                placeholder="페이지를 선택하세요"
                                inputProps={{ readOnly: true }}
                                isInvalid={error.page}
                            />
                        </Form.Row>

                        {/* api 입력 */}
                        <MokaInputLabel name="afterApi" label="API" className="mb-2" value={temp.afterApi} onChange={handleChangeValue} />

                        {/* 컴포넌트/컨테이너 선택 */}
                        <Form.Row className="mb-2 d-flex">
                            <div className="flex-shrink-0 mr-2" style={{ width: 74 }}>
                                <MokaInput as="select" name="areaDiv" value={temp.areaDiv} onChange={handleChangeValue}>
                                    <option value={ITEM_CP}>컴포넌트</option>
                                    <option value={ITEM_CT}>컨테이너</option>
                                </MokaInput>
                            </div>

                            <Form.Row className="flex-fill">
                                {temp.areaDiv === ITEM_CP && (
                                    <ComponentSelector
                                        component={component}
                                        areaComp={areaComp}
                                        setAreaComp={setAreaComp}
                                        onChange={handleChangeValue}
                                        compOptions={compOptions}
                                        error={error}
                                    />
                                )}

                                {temp.areaDiv === ITEM_CT && <ContainerSelector container={container} onChange={handleChangeValue} contOptions={contOptions} error={error} />}
                            </Form.Row>

                            {/* 일반형/가로형 선택 */}
                            <div className="ml-2 flex-shrink-0">
                                <MokaInput as="select" name="areaAlign" value={temp.areaAlign} onChange={handleChangeValue} disabled={temp.areaDiv === ITEM_CP}>
                                    <option value={AREA_ALIGN_V}>일반형</option>
                                    {temp.areaDiv === ITEM_CT && <option value={AREA_ALIGN_H}>가로형</option>}
                                </MokaInput>
                            </div>
                        </Form.Row>

                        {/* 컨테이너 리로드 문구 */}
                        {areaCompLoad.byContainer && <ContainerLoadBox message={areaCompLoad.byContainerMessage} onClick={() => getContOptions(true)} />}

                        {/* 컴포넌트 리로드 (페이지에 컴포넌트가 없어졌을 때) 문구 */}
                        {areaCompLoad.byPage && <ComponentLoadBox message={areaCompLoad.byPageMessage} onClick={() => getCompOptions(true)} />}

                        {/* 컴포넌트 리로드 (컨테이너에 컴포넌트가 없어졌을 때) 문구 */}
                        {areaCompLoad.byContainerComp && <ComponentLoadBox message={areaCompLoad.byContainerCompMessage} onClick={() => handleCompLoad(container)} />}

                        {/* 컨테이너일 경우 하위 컴포넌트 나열 */}
                        {temp.areaDiv === ITEM_CT &&
                            areaComps.map((comp, idx) => (
                                <AreaComp
                                    key={idx}
                                    areaComp={comp}
                                    areaComps={areaComps}
                                    index={idx}
                                    onChange={handleChangeValue}
                                    disabled={areaCompLoad.byContainer || areaCompLoad.byContainerComp || temp.areaAlign === AREA_ALIGN_V}
                                    setAreaComps={setAreaComps}
                                />
                            ))}

                        {/* 미리보기 리소스 */}
                        <Form.Row style={{ height: 200 }}>
                            <MokaInputLabel
                                label={
                                    <React.Fragment>
                                        미리보기
                                        <br />
                                        리소스
                                        <OverlayTrigger overlay={ResourcePopover} trigger={['click']}>
                                            <MokaIcon iconName="fas-info-circle" className="ml-1 color-info cursor-pointer" />
                                        </OverlayTrigger>
                                    </React.Fragment>
                                }
                                as="none"
                            />
                            <div className="flex-fill input-border overflow-hidden">
                                <MokaEditorCore defaultValue={temp.previewRsrc} value={previewRsrc} onBlur={(value) => setPreviewRsrc(value)} fullWindowButton />
                            </div>
                        </Form.Row>
                    </React.Fragment>
                )}
            </div>
        </MokaCard>
    );
};

export default AreaFormDepth2;
