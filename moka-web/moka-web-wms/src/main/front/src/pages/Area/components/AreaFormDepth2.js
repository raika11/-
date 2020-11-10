import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { ITEM_CP, ITEM_CT, AREA_COMP_ALIGN_LEFT, AREA_COMP_ALIGN_RIGHT, AREA_ALIGN_V, AREA_ALIGN_H } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput, MokaIcon, MokaOverlayTooltipButton } from '@components';
import { initialState, GET_AREA_DEPTH2, saveArea, changeArea } from '@store/area';
import { initialState as componentState, getComponentListModal } from '@store/component';
import { initialState as containerState, getContainerListModal } from '@store/container';
import toast from '@utils/toastUtil';

const AreaFormDepth2 = (props) => {
    const { onShowModal, page, setPage, onChangeModalDomainId, depth, onDelete } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const { domainList, areaCompLoadDepth2, areaCompLoadDepth3, depth1List, depth2List, areaDepth1, areaDepth2, areaDepth3, loading, selectedDepth } = useSelector((store) => ({
        domainList: store.auth.domainList,
        areaCompLoadDepth2: store.area.depth2.areaCompLoad,
        areaCompLoadDepth3: store.area.depth3.areaCompLoad,
        depth1List: store.area.depth1.list,
        depth2List: store.area.depth2.list,
        areaDepth1: store.area.depth1.area,
        areaDepth2: store.area.depth2.area,
        areaDepth3: store.area.depth3.area,
        loading: store.loading[GET_AREA_DEPTH2],
        selectedDepth: store.area.selectedDepth,
    }));

    // state
    const [origin, setOrigin] = useState({}); // 원본 데이터
    const [temp, setTemp] = useState({}); // 수정가능한 데이터
    const [parent, setParent] = useState({});
    const [domain, setDomain] = useState({});

    const [container, setContainer] = useState({});
    const [component, setComponent] = useState({});

    const [areaComps, setAreaComps] = useState([]); // DB에 저장되는 areaComp 리스트
    const [areaCompLoad, setAreaCompLoad] = useState({});
    const [reloaded, setReloaded] = useState(false); // reload 했는지 체크

    const [contOptions, setContOptions] = useState([]); // 컨테이너 options
    const [compOptions, setCompOptions] = useState([]); // 컴포넌트 options
    const [error, setError] = useState({ container: false });

    /**
     * input 값 변경
     * @param {object} e 이벤트객체
     */
    const handleChangeValue = (e) => {
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
        } else if (name === 'areaComp') {
            setComponent({ componentSeq: value });
        } else if (name === 'areaAlign') {
            setTemp({ ...temp, areaAlign: value });
        } else if (name === 'container') {
            setContainer({ containerSeq: value });
            setError({ ...error, container: false });
        }
    };

    /**
     * validate
     * @param {object} saveObj area data
     */
    const validate = (saveObj) => {
        let isInvalid = false;

        if (saveObj.areaDiv === ITEM_CT && !saveObj.container.containerSeq) {
            setError({ ...error, container: true });
            isInvalid = isInvalid || true;
        }

        return !isInvalid;
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        const save = {
            ...temp,
            page: Object.keys(page).length > 0 ? page : null,
            parent,
            domain,
            container: temp.areaDiv === ITEM_CT ? container : null,
            areaComps: temp.areaDiv === ITEM_CP ? [{ component }] : areaComps,
        };

        if (validate(save)) {
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
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        onDelete(temp);
    };

    /**
     * 컨테이너일 때 -> 컨테이너의 컴포넌트 목록 리로드
     */
    const handleCompLoad = useCallback(
        (reload) => {
            dispatch(
                getComponentListModal({
                    search: {
                        ...componentState.search,
                        usePaging: 'N',
                        useArea: 'Y',
                        searchType: 'containerSeq',
                        keyword: container.containerSeq,
                        domainId: page.domain.domainId,
                    },
                    callback: ({ body }) => {
                        setAreaComps(
                            body.list.map((b) => ({
                                compAlign: AREA_COMP_ALIGN_LEFT,
                                component: { ...b },
                            })),
                        );
                        if (reload) {
                            setReloaded(true);
                            setAreaCompLoad(initialState.depth2.areaCompLoad);
                        }
                    },
                }),
            );
        },
        [dispatch, container, page],
    );

    /**
     * 컴포넌트 options 조회
     */
    const getCompOptions = useCallback(() => {
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
                    if (body.list.length > 0) {
                        setComponent(body.list[0]);
                    }
                },
            }),
        );
    }, [dispatch, page]);

    /**
     * 컨테이너 options 조회
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
                    if (body.list.length > 0) {
                        setContainer(body.list[0]);
                    }
                },
            }),
        );
    }, [dispatch, page]);

    useEffect(() => {
        // depth에 따라 기본값 셋팅
        if (depth === 2) {
            setTemp(areaDepth2);
            setOrigin(areaDepth2);
            setAreaCompLoad(areaCompLoadDepth2);
        } else {
            setTemp(areaDepth3);
            setOrigin(areaDepth3);
            setAreaCompLoad(areaCompLoadDepth3);
        }
    }, [depth, areaDepth2, areaDepth3, areaCompLoadDepth2, areaCompLoadDepth3]);

    useEffect(() => {
        if (origin.areaDiv === ITEM_CP && origin.areaComps && origin.areaComps.length > 0) {
            setComponent(origin.areaComps[0].component);
        }
    }, [origin]);

    useEffect(() => {
        // parent, domain 데이터 셋팅
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

        // container 데이터 셋팅
        setContainer(temp.container || {});

        // areaComps 데이터 셋팅
        setAreaComps(temp.areaComps || []);
    }, [temp, depth, areaDepth1, areaDepth2]);

    useEffect(() => {
        // page 셋팅
        if (temp.page) {
            setPage(temp.page);
        } else {
            setPage({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp.areaSeq]);

    useEffect(() => {
        // 도메인 변경 시 모달의 도메인 검색조건 변경
        if (domain.domainId) {
            onChangeModalDomainId(domain.domainId);
        }
    }, [domain, onChangeModalDomainId]);

    useEffect(() => {
        // 모달한테 전달받은 page 변경 시 CP, CT 리스트 조회
        if (page.pageSeq) {
            if (temp.areaDiv === ITEM_CP) getCompOptions();
            else getContOptions();
        }
    }, [getCompOptions, getContOptions, page, temp.areaDiv]);

    useEffect(() => {
        // 컨테이너 변경 시 컨테이너 안의 컴포넌트 리스트 조회
        if (container.containerSeq) {
            handleCompLoad(false);
        } else {
            setAreaComps([]);
        }
    }, [container.containerSeq, handleCompLoad]);

    useEffect(() => {
        // 폼이 변경되면 CT, CP 리스트 날림
        setCompOptions([]);
        setContOptions([]);
    }, [selectedDepth, temp.areaSeq]);

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
                                    {depth1List.map((area) => (
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
                                    {depth2List.map((area) => (
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
                                <MokaInput as="select" name="container" value={container.containerSeq} onChange={handleChangeValue} isInvalid={error.container}>
                                    <option hidden>컨테이너를 선택하세요</option>
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
                            <MokaInput as="select" name="areaAlign" value={temp.areaAlign} onChange={handleChangeValue}>
                                <option value={AREA_ALIGN_V}>세로형</option>
                                {temp.areaDiv === ITEM_CT && <option value={AREA_ALIGN_H}>가로형</option>}
                            </MokaInput>
                        </Col>
                    </Form.Row>

                    {/* 리로드 문구 */}
                    {!reloaded && origin.areaDiv === ITEM_CP && areaCompLoad.byPage && (
                        <Form.Row className="mb-2">
                            <Col xs={2} className="p-0"></Col>
                            <Col xs={8} className="p-0 pl-2">
                                <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: areaCompLoad.byPageMessage.replace('\n', '<br/>') }} />
                            </Col>
                            <Col xs={2} className="p-0 d-flex align-items-center justify-content-start">
                                <MokaOverlayTooltipButton variant="white" className="border" tooltipText="컴포넌트 리로드" onClick={() => handleCompLoad(true)}>
                                    <MokaIcon iconName="far-redo-alt" />
                                </MokaOverlayTooltipButton>
                            </Col>
                        </Form.Row>
                    )}
                    {!reloaded && origin.areaDiv === ITEM_CT && areaCompLoad.byContainer && (
                        <Form.Row className="mb-2">
                            <Col xs={2} className="p-0"></Col>
                            <Col xs={8} className="p-0 pl-2">
                                <p className="mb-0 text-danger" dangerouslySetInnerHTML={{ __html: areaCompLoad.byContainerMessage.replace('\n', '<br/>') }} />
                            </Col>
                            <Col xs={2} className="p-0 d-flex align-items-center justify-content-start">
                                <MokaOverlayTooltipButton variant="white" className="border" tooltipText="컴포넌트 리로드" onClick={() => getCompOptions()}>
                                    <MokaIcon iconName="far-redo-alt" />
                                </MokaOverlayTooltipButton>
                            </Col>
                        </Form.Row>
                    )}

                    {/* 컨테이너일 경우 하위 컴포넌트 나열 */}
                    {temp.areaDiv === ITEM_CT &&
                        areaComps.map((comp) => (
                            <Form.Row className="mb-2" key={comp.component.componentSeq}>
                                <Col xs={2} className="p-0">
                                    <MokaInput value="컴포넌트" disabled />
                                </Col>
                                <Col xs={8} className="p-0 pl-2 pr-2">
                                    <MokaInput value={comp.component.componentName} inputProps={{ readOnly: true }} />
                                </Col>
                                <Col xs={2} className="p-0">
                                    <MokaInput as="select" name="compAlign" value={comp.compAlign} onChange={handleChangeValue} disabled={areaCompLoad.byContainer}>
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
                        <Button className="mr-10" onClick={handleClickSave}>
                            저장
                        </Button>
                        <Button variant="gray150">취소</Button>
                        {temp.areaSeq && (
                            <Button variant="danger" className="ml-10" onClick={handleClickDelete}>
                                삭제
                            </Button>
                        )}
                    </Card.Footer>
                </Col>
            </div>
        </MokaCard>
    );
};

export default AreaFormDepth2;
