import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { ITEM_CP, ITEM_CT, AREA_COMP_ALIGN_LEFT, AREA_COMP_ALIGN_RIGHT, AREA_ALIGN_V, AREA_ALIGN_H } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput, MokaIcon, MokaOverlayTooltipButton } from '@components';
import { GET_AREA_DEPTH2, GET_AREA_DEPTH3, SAVE_AREA, DELETE_AREA, saveArea, changeArea } from '@store/area';
import { initialState as componentState, getComponentListModal } from '@store/component';
import { initialState as containerState, getContainerListModal } from '@store/container';
import toast from '@utils/toastUtil';

const AreaFormDepth2 = (props) => {
    const { onShowModal, page, setPage, onChangeModalDomainId, depth, onDelete } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const {
        domainList,
        areaCompLoadDepth2,
        areaCompLoadDepth3,
        areaListDepth1,
        areaListDepth2,
        areaListDepth3,
        areaDepth1,
        areaDepth2,
        areaDepth3,
        loading,
        selectedDepth,
    } = useSelector((store) => ({
        domainList: store.auth.domainList,
        areaCompLoadDepth2: store.area.depth2.areaCompLoad,
        areaCompLoadDepth3: store.area.depth3.areaCompLoad,
        areaListDepth1: store.area.depth1.list,
        areaListDepth2: store.area.depth2.list,
        areaListDepth3: store.area.depth3.list,
        areaDepth1: store.area.depth1.area,
        areaDepth2: store.area.depth2.area,
        areaDepth3: store.area.depth3.area,
        loading: store.loading[GET_AREA_DEPTH2] || store.loading[GET_AREA_DEPTH3] || store.loading[SAVE_AREA] || store.loading[DELETE_AREA],
        selectedDepth: store.area.selectedDepth,
    }));

    // state
    const [origin, setOrigin] = useState({}); // 원본 데이터
    const [temp, setTemp] = useState({}); // 수정가능한 데이터
    const [parent, setParent] = useState({});
    const [domain, setDomain] = useState({});

    const [container, setContainer] = useState({}); // 선택한 컨테이너 담고 있는 state
    const [component, setComponent] = useState({}); // 선택한 컴포넌트 담고 있는 state
    const [areaComps, setAreaComps] = useState([]); // DB에 저장되는 areaComp 리스트
    const [areaCompLoad, setAreaCompLoad] = useState({});

    const [contOptions, setContOptions] = useState([]); // 컨테이너 options
    const [compOptions, setCompOptions] = useState([]); // 컴포넌트 options
    const [contCnt, setContCnt] = useState(0); // 컨테이너 load 카운트
    const [compCnt, setCompCnt] = useState(0); // 컴포넌트 load 카운트
    const [error, setError] = useState({ page: false });

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
        } else if (name === 'areaNm') {
            setTemp({ ...temp, areaNm: value });
        } else if (name === 'previewRsrc') {
            setTemp({ ...temp, previewRsrc: value });
        } else if (name === 'domain') {
            setDomain({ domainId: e.target.value });
        } else if (name === 'areaDiv') {
            setTemp({ ...temp, areaDiv: value });
            setAreaComps([]);
        } else if (name === 'areaComp') {
            setComponent({ componentSeq: value });
        } else if (name === 'areaAlign') {
            setTemp({ ...temp, areaAlign: value });
        } else if (name === 'container') {
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
        }
    };

    /**
     * validate
     * @param {object} saveObj area data
     */
    const validate = (saveObj) => {
        let isInvalid = false;
        return !isInvalid;
    };

    /**
     * 저장
     * @param {object} save area데이터
     */
    const handleSave = (save) => {
        dispatch(
            saveArea({
                depth,
                actions: [changeArea({ area: save, depth })],
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        if (depth === 2) {
                            history.push(`/area/${body.parent.areaSeq}/${body.areaSeq}`);
                        } else {
                            history.push(`/area/${areaDepth1.areaSeq}/${body.parent.areaSeq}/${body.areaSeq}`);
                        }
                    } else {
                        toast.warn(header.message);
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

        let save = {
            ...temp,
            page: Object.keys(page).length > 0 ? { pageSeq: page.pageSeq } : null,
            parent: Object.keys(parent).length > 0 ? { areaSeq: parent.areaSeq } : null,
            domain,
        };

        if (temp.areaDiv === ITEM_CP) {
            save.container = null;
            if (component.componentSeq) {
                save.areaComps = [{ ...component, ordNo: 1 }];
            }
        } else {
            save.container = container;
            save.areaComps = areaComps.map((comp) => ({
                ...comp,
                ordNo: comp.component.relOrd + 1,
            }));
        }

        if (validate(save)) {
            if (depth === 2 && areaListDepth3.length > 0 && save.usedYn === 'N') {
                toast.confirm(
                    <React.Fragment>
                        하위 뎁스 메뉴도 편집 영역에 노출되지 않습니다.
                        <br />
                        사용여부를 off 하시겠습니까?
                    </React.Fragment>,
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
                            domainId: page.domain.domainId,
                        },
                        callback: ({ body }) => {
                            setAreaComps(
                                body.list.map((b) => ({
                                    compAlign: AREA_COMP_ALIGN_LEFT,
                                    component: { ...b },
                                })),
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
        [areaCompLoad, dispatch, page],
    );

    /**
     * 페이지의 컴포넌트 options 조회
     */
    const getCompOptions = useCallback(() => {
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
                        domainId: page.domain.domainId,
                    },
                    callback: ({ body }) => {
                        setCompOptions(body.list || []);

                        if (origin.areaDiv === ITEM_CP && compCnt < 1) {
                            setComponent(origin.areaComps.length > 0 ? origin.areaComps[0].component : component || {});
                        } else {
                            setAreaCompLoad({
                                ...areaCompLoad,
                                byPage: false,
                                byPageMessage: null,
                            });
                            setComponent({});
                        }
                        setCompCnt(compCnt + 1);
                    },
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaCompLoad, compCnt, error, page]);

    /**
     * 페이지의 컨테이너 options 조회
     */
    const getContOptions = useCallback(() => {
        dispatch(
            getContainerListModal({
                search: {
                    ...containerState.search,
                    usePaging: 'N',
                    searchType: 'pageSeq',
                    keyword: page.pageSeq,
                    domainId: page.domain.domainId,
                },
                callback: ({ body }) => {
                    setContOptions(body.list || []);

                    if (contCnt < 1) {
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
                    setContCnt(contCnt + 1);
                },
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaCompLoad, contCnt, page]);

    useEffect(() => {
        setInit();
    }, [setInit]);

    useEffect(() => {
        // origin 데이터 가져오는 부분
        if (origin.areaDiv === ITEM_CP && origin.areaComps && origin.areaComps.length > 0) {
            setComponent(origin.areaComps[0].component);
        }
        // areaComps 셋팅
        if (Array.isArray(origin.areaComps)) {
            setAreaComps(origin.areaComps);
        }
    }, [origin]);

    useEffect(() => {
        /**
         * areaSeq가 변경될 때 초기화!!!!
         * 1) page, parent, domain 데이터 변경
         * 2) cnt 0으로 셋팅
         */
        if (temp.page) {
            setPage(temp.page);
        } else {
            setPage({});
        }
        if (!temp.areaSeq) {
            setComponent({});
            setContainer({});
        }
        if (temp.parent && temp.parent.areaSeq) {
            setParent(temp.parent);
            setDomain(temp.domain);
        } else if (depth === 2) {
            setParent(areaDepth1);
            setDomain(areaDepth1.domain || {});
        } else {
            setParent(areaDepth2);
            setDomain(areaDepth2.domain || {});
        }
        setContCnt(0);
        setCompCnt(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp.areaSeq, depth]);

    useEffect(() => {
        // 도메인 변경 시 페이지 변경 모달의 도메인 검색조건 변경
        if (domain.domainId) {
            onChangeModalDomainId(domain.domainId);
        }
    }, [domain, onChangeModalDomainId]);

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
    }, [page.pageSeq, temp.areaDiv]);

    useEffect(() => {
        // 폼이 변경되면 CT, CP 리스트 날림
        setCompOptions([]);
        setContOptions([]);
    }, [selectedDepth]);

    return (
        <MokaCard title={`편집영역 ${temp.areaSeq ? '정보' : '등록'}`} className="flex-fill" loading={loading}>
            <div className="d-flex justify-content-center">
                <Col xs={10} className="p-0">
                    {/* 사용여부 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel
                            as="switch"
                            id="usedYn"
                            name="usedYn"
                            labelWidth={87}
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
                                    labelWidth={87}
                                    label="그룹 영역"
                                    value={parent.areaSeq}
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
                                <MokaInputLabel className="mb-0" labelWidth={87} label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
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
                                    labelWidth={87}
                                    label="중분류 영역"
                                    value={parent.areaSeq}
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
                                <MokaInputLabel className="mb-0" labelWidth={87} label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                            </Col>
                        </Form.Row>
                    )}

                    {/* 도메인 */}
                    <MokaInputLabel
                        className="mb-2"
                        as="select"
                        label="도메인"
                        name="domain"
                        labelWidth={87}
                        value={domain.domainId}
                        disabled={parent.areaSeq && domain.domainId ? true : false}
                        onChange={handleChangeValue}
                    >
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domainId}>
                                {domain.domainUrl}
                            </option>
                        ))}
                    </MokaInputLabel>

                    {/* 영역명 */}
                    <MokaInputLabel className="mb-2" label="영역명" labelWidth={87} name="areaNm" value={temp.areaNm} onChange={handleChangeValue} />

                    <hr className="divider" />

                    {/* 페이지 검색 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel as="none" className="mb-0" label="페이지" labelWidth={87} />
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

                    {/* 컴포넌트/컨테이너 선택 */}
                    <Form.Row className="mb-2">
                        <Col xs={2} className="p-0">
                            <MokaInput as="select" name="areaDiv" value={temp.areaDiv} onChange={handleChangeValue}>
                                <option value={ITEM_CP}>컴포넌트</option>
                                <option value={ITEM_CT}>컨테이너</option>
                            </MokaInput>
                        </Col>

                        {temp.areaDiv === ITEM_CP && (
                            <Col xs={8} className="p-0 pl-2 pr-2">
                                <MokaInput as="select" name="areaComp" value={component.componentSeq} onChange={handleChangeValue} isInvalid={error.component}>
                                    <option hidden>컴포넌트를 선택하세요</option>
                                    {compOptions.map((com) => (
                                        <option value={com.componentSeq} key={com.componentSeq}>
                                            {com.componentName}
                                        </option>
                                    ))}
                                </MokaInput>
                            </Col>
                        )}

                        {temp.areaDiv === ITEM_CT && (
                            <Col xs={8} className="p-0 pl-2 pr-2">
                                <MokaInput as="select" name="container" value={container.containerSeq} onChange={handleChangeValue}>
                                    <option hidden>컨테이너를 선택하세요</option>
                                    <option value="">컨테이너를 선택하세요</option>
                                    {contOptions.map((con) => (
                                        <option value={con.containerSeq} key={con.containerSeq}>
                                            {con.containerName}
                                        </option>
                                    ))}
                                </MokaInput>
                            </Col>
                        )}

                        {/* 세로형/가로형 선택 */}
                        <Col xs={2} className="p-0">
                            <MokaInput as="select" name="areaAlign" value={temp.areaAlign} onChange={handleChangeValue} className="ft-12">
                                <option value={AREA_ALIGN_V}>세로형</option>
                                {temp.areaDiv === ITEM_CT && <option value={AREA_ALIGN_H}>가로형</option>}
                            </MokaInput>
                        </Col>
                    </Form.Row>

                    {/* 컨테이너 리로드 문구 */}
                    {origin.areaDiv === ITEM_CT && areaCompLoad.byContainer && (
                        <Form.Row className="mb-2">
                            <Col xs={2} className="p-0"></Col>
                            <Col xs={8} className="p-0 pl-2">
                                <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: areaCompLoad.byContainerMessage.replace('\n', '<br/>') }} />
                            </Col>
                            <Col xs={2} className="p-0 d-flex align-items-center justify-content-start">
                                <MokaOverlayTooltipButton variant="outline-neutral" className="border" tooltipText="컨테이너 리로드" onClick={getContOptions}>
                                    <MokaIcon iconName="far-redo-alt" />
                                </MokaOverlayTooltipButton>
                            </Col>
                        </Form.Row>
                    )}
                    {/* 컴포넌트 리로드 문구 */}
                    {origin.areaDiv === ITEM_CP && areaCompLoad.byPage && (
                        <Form.Row className="mb-2">
                            <Col xs={2} className="p-0"></Col>
                            <Col xs={8} className="p-0 pl-2">
                                <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: areaCompLoad.byPageMessage.replace('\n', '<br/>') }} />
                            </Col>
                            <Col xs={2} className="p-0 d-flex align-items-center justify-content-start">
                                <MokaOverlayTooltipButton variant="outline-neutral" className="border" tooltipText="컴포넌트 리로드" onClick={getCompOptions}>
                                    <MokaIcon iconName="far-redo-alt" />
                                </MokaOverlayTooltipButton>
                            </Col>
                        </Form.Row>
                    )}
                    {origin.areaDiv === ITEM_CT && areaCompLoad.byContainerComp && (
                        <Form.Row className="mb-2">
                            <Col xs={2} className="p-0"></Col>
                            <Col xs={8} className="p-0 pl-2">
                                <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: areaCompLoad.byContainerCompMessage.replace('\n', '<br/>') }} />
                            </Col>
                            <Col xs={2} className="p-0 d-flex align-items-center justify-content-start">
                                <MokaOverlayTooltipButton variant="outline-neutral" className="border" tooltipText="컴포넌트 리로드" onClick={() => handleCompLoad(container)}>
                                    <MokaIcon iconName="far-redo-alt" />
                                </MokaOverlayTooltipButton>
                            </Col>
                        </Form.Row>
                    )}

                    {/* 컨테이너일 경우 하위 컴포넌트 나열 */}
                    {temp.areaDiv === ITEM_CT &&
                        areaComps.map((comp, idx) => (
                            <Form.Row className="mb-2" key={comp.component.componentSeq}>
                                <Col xs={2} className="p-0">
                                    <MokaInput value="컴포넌트" disabled />
                                </Col>
                                <Col xs={8} className="p-0 pl-2 pr-2">
                                    <MokaInput value={comp.component.componentName} inputProps={{ readOnly: true }} />
                                </Col>
                                <Col xs={2} className="p-0">
                                    <MokaInput
                                        as="select"
                                        name="compAlign"
                                        value={comp.compAlign}
                                        onChange={(e) => handleChangeValue(e, idx)}
                                        className="ft-12"
                                        disabled={areaCompLoad.byContainer || areaCompLoad.byContainerComp || temp.areaAlign === AREA_ALIGN_V}
                                    >
                                        <option value={AREA_COMP_ALIGN_LEFT}>Left 영역</option>
                                        <option value={AREA_COMP_ALIGN_RIGHT}>Right 영역</option>
                                    </MokaInput>
                                </Col>
                            </Form.Row>
                        ))}

                    {/* 미리보기 리소스 */}
                    <MokaInputLabel
                        as="textarea"
                        name="previewRsrc"
                        label={
                            <>
                                미리보기
                                <br />
                                리소스
                            </>
                        }
                        labelWidth={87}
                        inputClassName="resize-none"
                        inputProps={{ rows: 5 }}
                        value={temp.previewRsrc}
                        onChange={handleChangeValue}
                    />

                    {/* 버튼 그룹 */}
                    <Card.Footer className="d-flex justify-content-center">
                        <Button variant="positive" onClick={handleClickSave}>
                            저장
                        </Button>
                        <Button variant="negative" className="ml-10" onClick={handleClickDelete} disabled={!temp.areaSeq}>
                            삭제
                        </Button>
                    </Card.Footer>
                </Col>
            </div>
        </MokaCard>
    );
};

export default AreaFormDepth2;
