import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { ITEM_CP, ITEM_CT, AREA_COMP_ALIGN_LEFT, AREA_ALIGN_V, AREA_ALIGN_H } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput } from '@components';
import ComponentSelector from './ComponentSelector';
import ContainerSelector from './ContainerSelector';
import AreaComp from './AreaComp';
import ComponentLoadBox from './ComponentLoadBox';
import ContainerLoadBox from './ContainerLoadBox';
import { GET_AREA_DEPTH2, GET_AREA_DEPTH3, SAVE_AREA, DELETE_AREA, saveArea, changeInvalidList } from '@store/area';
import { initialState as componentState, getComponentListModal } from '@store/component';
import { initialState as containerState, getContainerListModal } from '@store/container';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';

const AreaFormDepth2 = (props) => {
    const { onShowModal, page, setPage, onChangeModalDomainId, depth, onDelete } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector((store) => store.loading[GET_AREA_DEPTH2] || store.loading[GET_AREA_DEPTH3] || store.loading[SAVE_AREA] || store.loading[DELETE_AREA]);
    const domainList = useSelector((store) => store.auth.domainList);
    const { areaListDepth1, areaDepth1 } = useSelector((store) => ({
        areaListDepth1: store.area.depth1.list,
        areaDepth1: store.area.depth1.area,
    }));
    const { areaListDepth2, areaCompLoadDepth2, areaDepth2 } = useSelector((store) => ({
        areaListDepth2: store.area.depth2.list,
        areaCompLoadDepth2: store.area.depth2.areaCompLoad,
        areaDepth2: store.area.depth2.area,
    }));
    const { areaListDepth3, areaCompLoadDepth3, areaDepth3 } = useSelector((store) => ({
        areaListDepth3: store.area.depth3.list,
        areaCompLoadDepth3: store.area.depth3.areaCompLoad,
        areaDepth3: store.area.depth3.area,
    }));
    const { invalidList, selectedDepth } = useSelector((store) => ({
        invalidList: store.area.invalidList,
        selectedDepth: store.area.selectedDepth,
    }));

    // state
    const [origin, setOrigin] = useState({}); // 원본 데이터
    const [temp, setTemp] = useState({}); // 수정가능한 데이터
    const [parent, setParent] = useState({}); // 부모 데이터
    const [domain, setDomainId] = useState({}); // 도메인

    const [container, setContainer] = useState({}); // 선택한 컨테이너 담고 있는 state
    const [component, setComponent] = useState({}); // 선택한 컴포넌트 담고 있는 state
    const [areaComp, setAreaComp] = useState({}); // areaDiv === ITEM_CP 일 때 areaComp 1개
    const [areaComps, setAreaComps] = useState([]); // areaDiv === ITEM_CT 일 때 DB에 저장되는 areaComp 리스트
    const [areaCompLoad, setAreaCompLoad] = useState({});

    const [contOptions, setContOptions] = useState([]); // 컨테이너 options
    const [compOptions, setCompOptions] = useState([]); // 컴포넌트 options
    const [loadCnt, setLoadCnt] = useState(0); // CP, CT options load 카운트
    const [error, setError] = useState({ areaNm: false, page: false });

    /**
     * depth에 따라 기본값 셋팅
     */
    const setInit = useCallback(() => {
        if (depth === 2) {
            setTemp(areaDepth2);
            setOrigin(areaDepth2);
            setAreaCompLoad(areaCompLoadDepth2);
        } else {
            setTemp(areaDepth3);
            setOrigin(areaDepth3);
            setAreaCompLoad(areaCompLoadDepth3);
        }
    }, [areaCompLoadDepth2, areaCompLoadDepth3, areaDepth2, areaDepth3, depth]);

    /**
     * input 값 변경
     * @param {object} e 이벤트객체
     * @param {number} index
     */
    const handleChangeValue = (e, idx) => {
        const { name, value, checked, selectedOptions } = e.target;

        if (name === 'usedYn') {
            if (checked) setTemp({ ...temp, usedYn: 'Y' });
            else setTemp({ ...temp, usedYn: 'N' });
        } else if (name === 'parent') {
            const { areanm } = selectedOptions[0].dataset;
            setParent({ areaSeq: value, areanm });
        } else if (name === 'domain') {
            setDomainId({ domainId: e.target.value });
            onChangeModalDomainId(e.target.value);
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
    };

    /**
     * validate
     * @param {object} saveObj area data
     */
    const validate = (saveObj) => {
        let isInvalid = false;
        let errList = [];

        if (!REQUIRED_REGEX.test(saveObj.areaNm)) {
            errList.push({
                field: 'areaNm',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장
     * @param {object} save area데이터
     */
    const handleSave = (save) => {
        dispatch(
            saveArea({
                area: save,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        if (depth === 2) {
                            history.push(`/area/${body.parent.areaSeq}/${body.areaSeq}`);
                        } else {
                            history.push(`/area/${areaDepth1.areaSeq}/${body.parent.areaSeq}/${body.areaSeq}`);
                        }
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
            toast.error(areaCompLoad.byContainerMessage);
            return;
        } else if (areaCompLoad.byPage) {
            toast.error(areaCompLoad.byPageMessage);
            return;
        } else if (areaCompLoad.byContainerComp) {
            toast.error(areaCompLoad.byContainerCompMessage);
            return;
        }

        if (!page?.pageSeq) {
            toast.warning('페이지, 컴포넌트 혹은 컨테이너를 선택하세요');
            return;
        }

        let save = {
            ...temp,
            page: page.pageSeq ? { pageSeq: page.pageSeq, pageName: page.pageName, pageUrl: page.pageUrl } : null,
            parent: parent.areaSeq ? { areaSeq: parent.areaSeq } : null,
            domain: domain,
        };

        if (temp.areaDiv === ITEM_CP) {
            save.container = null;
            save.areaComps = null;
            if (component.componentSeq) {
                save.areaComp = { ...areaComp, component, ordNo: 1 };
            }
        } else {
            save.container = container;
            save.areaComp = null;
            save.areaComps = areaComps;
        }

        if (validate(save)) {
            if (depth === 2 && areaListDepth3.length > 0 && save.usedYn === 'N') {
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
    const handleClickDelete = () => onDelete(temp);

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
                            // 오리지널 areaComps의 deskingPart를 셋팅
                            setAreaComps(
                                body.list.map((b) => {
                                    let deskingPart = null;
                                    if (origin.areaComps?.length > 0) {
                                        const tgt = origin.areaComps.find((o) => o.component !== null && o.component?.componentSeq === b.componentSeq);
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
        [areaCompLoad, dispatch, origin.areaComps, page.domain],
    );

    /**
     * 페이지의 컴포넌트 options 조회
     */
    const getCompOptions = useCallback(() => {
        setAreaComps([]);

        if (!page.pageSeq) {
            setError({ ...error, page: true });
        } else {
            dispatch(
                getComponentListModal({
                    search: {
                        ...componentState.search,
                        usePaging: 'N',
                        useArea: 'Y',
                        searchType: 'pageSeq',
                        keyword: page.pageSeq,
                        domainId: page.domain?.domainId,
                    },
                    callback: ({ body }) => {
                        setCompOptions(body.list || []);

                        if (loadCnt < 1) {
                            setAreaComp(origin.areaComp || {});
                            setComponent(origin.areaComp && origin.areaComp.component ? origin.areaComp.component : component || {});
                        } else {
                            setAreaCompLoad({
                                ...areaCompLoad,
                                byPage: false,
                                byPageMessage: null,
                            });
                            setAreaComp({});
                            setComponent({});
                        }
                        setLoadCnt(loadCnt + 1);
                    },
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaCompLoad, loadCnt, error, page]);

    /**
     * 페이지의 컨테이너 options 조회
     */
    const getContOptions = useCallback(() => {
        setComponent({});

        dispatch(
            getContainerListModal({
                search: {
                    ...containerState.search,
                    usePaging: 'N',
                    searchType: 'pageSeq',
                    keyword: page.pageSeq,
                    domainId: page.domain?.domainId,
                },
                callback: ({ body }) => {
                    setContOptions(body.list || []);

                    if (loadCnt < 1) {
                        setContainer(origin.container || {});
                    } else {
                        setAreaCompLoad({
                            ...areaCompLoad,
                            byContainer: false,
                            byContainerMessage: null,
                        });
                        setContainer({});
                        setAreaComps([]);
                    }
                    setLoadCnt(loadCnt + 1);
                },
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaCompLoad, loadCnt, page]);

    useEffect(() => {
        setInit();
    }, [setInit]);

    useEffect(() => {
        /**
         * origin 데이터로 초기값 설정
         * 1) areaComp, areaComps 셋팅
         * 2) page 셋팅
         */
        if (origin.areaDiv === ITEM_CP && origin.areaComp) {
            setComponent(origin.areaComp.component || {});
            setAreaComp(origin.areaComp);
            setAreaComps([]);
        }
        if (origin.areaDiv === ITEM_CT && Array.isArray(origin.areaComps)) {
            setAreaComps(origin.areaComps);
        }
        origin.page && setPage(origin.page);
    }, [origin, setPage]);

    useEffect(() => {
        /**
         * temp 데이터 변경 시
         * 1) parent, domain 데이터 변경
         * 2) cnt 0으로 셋팅
         */
        if (!temp.areaSeq) {
            setComponent({});
            setContainer({});
        }
        if (temp.parent?.areaSeq) {
            setParent(temp.parent);
        } else if (depth === 2) {
            setParent(areaDepth1);
        } else if (depth === 3) {
            setParent(areaDepth2);
        }
        setDomainId(areaDepth1.domain);
        setLoadCnt(0);
    }, [temp, areaDepth1, areaDepth2, setPage, depth]);

    useEffect(() => {
        // 모달한테 전달받은 page 변경 시, 혹은 areaDiv 변경 시 CP, CT 리스트 조회
        if (page.pageSeq) {
            setError({ ...error, page: false });
            if (temp.areaDiv === ITEM_CP) getCompOptions();
            else getContOptions();
        } else {
            setCompOptions([]);
            setContOptions([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, temp.areaDiv]);

    useEffect(() => {
        // 폼이 변경되면 CT, CP 리스트 날림
        setCompOptions([]);
        setContOptions([]);
    }, [selectedDepth]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    return (
        <MokaCard
            title={`편집영역 ${temp.areaSeq ? '정보' : '등록'}`}
            className="flex-fill"
            loading={loading}
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                {
                    text: '저장',
                    variant: 'positive',
                    className: 'mr-2',
                    onClick: handleClickSave,
                },
                {
                    text: '삭제',
                    variant: 'negative',
                    onClick: handleClickDelete,
                    disabled: !temp.areaSeq,
                },
            ]}
        >
            <div className="d-flex justify-content-center">
                <Col xs={10} className="p-0">
                    {/* 사용여부 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel
                            as="switch"
                            id="usedYn"
                            name="usedYn"
                            labelWidth={81}
                            label="사용여부"
                            className="mb-0"
                            inputProps={{ checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>

                    {/* Depth1 리스트 */}
                    {depth === 2 && (
                        <Form.Row className="mb-2">
                            <Col xs={7} className="p-0">
                                <MokaInputLabel
                                    as="select"
                                    name="parent"
                                    className="mb-0"
                                    labelWidth={81}
                                    label="그룹 영역"
                                    value={parent?.areaSeq}
                                    onChange={handleChangeValue}
                                    disabled={areaDepth1.areaSeq ? true : false}
                                >
                                    {areaListDepth1.map((area) => (
                                        <option key={area.areaSeq} value={area.areaSeq} data-areanm={area.areaNm}>
                                            {area.areaNm}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                            <Col xs={5} className="p-0">
                                <MokaInputLabel className="mb-0" labelWidth={81} label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                            </Col>
                        </Form.Row>
                    )}

                    {/* Depth2 리스트 */}
                    {depth === 3 && (
                        <Form.Row className="mb-2">
                            <Col xs={7} className="p-0">
                                <MokaInputLabel
                                    as="select"
                                    name="parent"
                                    className="mb-0"
                                    labelWidth={81}
                                    label="중분류 영역"
                                    value={parent?.areaSeq}
                                    onChange={handleChangeValue}
                                    disabled={areaDepth2.areaSeq ? true : false}
                                >
                                    {areaListDepth2.map((area) => (
                                        <option key={area.areaSeq} value={area.areaSeq} data-areanm={area.areaNm}>
                                            {area.areaNm}
                                        </option>
                                    ))}
                                </MokaInputLabel>
                            </Col>
                            <Col xs={5} className="p-0">
                                <MokaInputLabel className="mb-0" labelWidth={81} label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                            </Col>
                        </Form.Row>
                    )}

                    {/* 도메인 */}
                    <MokaInputLabel
                        className="mb-2"
                        as="select"
                        label="도메인"
                        name="domain"
                        labelWidth={81}
                        value={domain?.domainId}
                        disabled={parent?.areaSeq ? true : false}
                        onChange={handleChangeValue}
                    >
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domainId}>
                                {domain.domainUrl}
                            </option>
                        ))}
                    </MokaInputLabel>

                    {/* 영역명 */}
                    <MokaInputLabel
                        className="mb-2"
                        label="영역명"
                        labelWidth={81}
                        name="areaNm"
                        value={temp.areaNm}
                        onChange={handleChangeValue}
                        isInvalid={error.areaNm}
                        required
                    />

                    <hr className="divider" />

                    {/* 페이지 검색 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" className="mb-0" label="페이지" labelWidth={81} />
                        <MokaSearchInput
                            className="w-100"
                            inputClassName="bg-white"
                            variant="dark"
                            value={page.pageSeq ? `${page.pageName} (${page.pageUrl})` : ''}
                            onSearch={() => onShowModal(true)}
                            placeholder="페이지를 선택하세요"
                            inputProps={{ readOnly: true }}
                            isInvalid={error.page}
                        />
                    </Form.Row>

                    {/* api 입력 */}
                    <MokaInputLabel name="afterApi" label="API" className="mb-2" labelWidth={81} value={temp.afterApi} onChange={handleChangeValue} />

                    {/* 컴포넌트/컨테이너 선택 */}
                    <Form.Row className="mb-2">
                        <Col xs={2} className="p-0">
                            <MokaInput as="select" name="areaDiv" value={temp.areaDiv} onChange={handleChangeValue}>
                                <option value={ITEM_CP}>컴포넌트</option>
                                <option value={ITEM_CT}>컨테이너</option>
                            </MokaInput>
                        </Col>

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

                        {temp.areaDiv === ITEM_CT && <ContainerSelector container={container} onChange={handleChangeValue} contOptions={contOptions} />}

                        {/* 세로형/가로형 선택 */}
                        <Col xs={2} className="p-0">
                            <MokaInput as="select" name="areaAlign" value={temp.areaAlign} onChange={handleChangeValue}>
                                <option value={AREA_ALIGN_V}>세로형</option>
                                {temp.areaDiv === ITEM_CT && <option value={AREA_ALIGN_H}>가로형</option>}
                            </MokaInput>
                        </Col>
                    </Form.Row>

                    {/* 컨테이너 리로드 문구 */}
                    {origin.areaDiv === ITEM_CT && areaCompLoad.byContainer && <ContainerLoadBox message={areaCompLoad.byContainerMessage} onClick={getContOptions} />}

                    {/* 컴포넌트 리로드 (페이지에 컴포넌트가 없어졌을 때) 문구 */}
                    {origin.areaDiv === ITEM_CP && areaCompLoad.byPage && <ComponentLoadBox message={areaCompLoad.byPageMessage} onClick={getCompOptions} />}

                    {/* 컴포넌트 리로드 (컨테이너에 컴포넌트가 없어졌을 때) 문구 */}
                    {origin.areaDiv === ITEM_CT && areaCompLoad.byContainerComp && (
                        <ComponentLoadBox message={areaCompLoad.byContainerCompMessage} onClick={() => handleCompLoad(container)} />
                    )}

                    {/* 컨테이너일 경우 하위 컴포넌트 나열 */}
                    {temp.areaDiv === ITEM_CT &&
                        areaComps.map((comp, idx) => (
                            <AreaComp
                                key={idx}
                                areaComp={comp}
                                areaComps={areaComps}
                                index={idx}
                                onChange={handleChangeValue}
                                disalbed={areaCompLoad.byContainer || areaCompLoad.byContainerComp || temp.areaAlign === AREA_ALIGN_V}
                                setAreaComps={setAreaComps}
                            />
                        ))}

                    {/* 미리보기 리소스 */}
                    <MokaInputLabel
                        as="textarea"
                        name="previewRsrc"
                        label="미리보기\n리소스"
                        labelWidth={81}
                        inputClassName="resize-none"
                        inputProps={{ rows: 5 }}
                        value={temp.previewRsrc}
                        onChange={handleChangeValue}
                    />
                </Col>
            </div>
        </MokaCard>
    );
};

export default AreaFormDepth2;
