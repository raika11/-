import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { ITEM_CP, ITEM_CT, ITEM_PG } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput } from '@components';
import { GET_AREA_DEPTH2, saveArea, changeArea } from '@store/area';
import { initialState as componentState, getComponentListModal } from '@store/component';
import toast from '@utils/toastUtil';

const AreaFormDepth2 = (props) => {
    const { onShowModal, page, onChangeModalDomainId, depth } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const { domainList, depth1List, depth2List, areaDepth1, areaDepth2, areaDepth3, loading } = useSelector((store) => ({
        domainList: store.auth.domainList,
        depth1List: store.area.depth1.list,
        depth2List: store.area.depth2.list,
        areaDepth1: store.area.depth1.area,
        areaDepth2: store.area.depth2.area,
        areaDepth3: store.area.depth3.area,
        loading: store.loading[GET_AREA_DEPTH2],
    }));

    // state
    const [temp, setTemp] = useState({});
    const [parent, setParent] = useState({});
    const [domain, setDomain] = useState({});
    const [container, setContainer] = useState({});
    const [areaComp, setAreaComp] = useState({}); // 파싱하기 위해 추가한 areaComp 1건
    const [areaComps, setAreaComps] = useState([]); // DB에 저장되는 areaComp 리스트

    const [containerList, setContainerList] = useState([]);
    const [componentList, setComponentList] = useState([]);

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
            // areaComps 의 데이터를 areaComp로 변경 (리스트의 첫번째 데이터로)
            setAreaComps([
                {
                    componentSeq: value,
                    componentName: selectedOptions[0].dataset.name,
                },
            ]);
        }
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        const save = {
            ...temp,
            container: temp.container && Object.keys(temp.container).length > 0 ? temp.container : null,
            page,
            parent,
            domain,
            areaComps,
        };
        console.log(save);

        dispatch(
            saveArea({
                depth,
                actions: [changeArea({ area: save, depth })],
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        if (depth === 2) {
                            history.push(`/area/${body.parent.areaSeq}/${body.areaSeq}`);
                        }
                    } else {
                        toast.warn(header.message);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        if (depth === 2) {
            setTemp(areaDepth2);
        } else {
            setTemp(areaDepth3);
        }
    }, [depth, areaDepth2, areaDepth3]);

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
        if (areaComps.length > 0) {
            setAreaComp(areaComps[0]);
        }
    }, [areaComps]);

    useEffect(() => {
        // 도메인 변경 시 모달의 도메인 검색조건 변경
        if (domain.domainId) {
            onChangeModalDomainId(domain.domainId);
        }
    }, [domain, onChangeModalDomainId]);

    useEffect(() => {
        // 모달한테 전달받은 page 변경 시 CP, CT 리스트 조회
        if (page.pageSeq) {
            dispatch(
                getComponentListModal({
                    search: {
                        ...componentState.search,
                        usePaging: 'N',
                        useArea: 'Y',
                        searchType: ITEM_PG,
                        keyword: page.pageSeq,
                        domainId: page.domain.domainId,
                    },
                    callback: ({ body }) => {
                        setComponentList(body.list || []);
                    },
                }),
            );
        }
    }, [dispatch, page]);

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
                    <MokaInputLabel className="mb-2" label="영역명" labelWidth={87} name="areaNm" value={temp.areaNm} onChange={handleChangeValue} required />

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
                                <MokaInput as="select" name="areaComp" value={areaComp.componentSeq} onChange={handleChangeValue}>
                                    <option hidden>컴포넌트를 선택하세요</option>
                                    {componentList.map((com) => (
                                        <option value={com.componentSeq} key={com.componentSeq} data-name={com.componentName}>
                                            {com.componentName}
                                        </option>
                                    ))}
                                </MokaInput>
                            </Col>
                        )}

                        {temp.areaDiv === ITEM_CT && (
                            <Col xs={8} className="p-0 pl-2 pr-2">
                                <MokaInput as="select" name="container" value={container.containerSeq}>
                                    <option hidden>컨테이너를 선택하세요</option>
                                    <option>선택</option>
                                </MokaInput>
                            </Col>
                        )}

                        <Col xs={2} className="p-0">
                            <MokaInput as="select">
                                <option>일반형</option>
                                {temp.areaDiv === ITEM_CT && <option>세로형</option>}
                            </MokaInput>
                        </Col>
                    </Form.Row>

                    {/* 컨테이너일 경우 하위 컴포넌트 나열 */}

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
                    </Card.Footer>
                </Col>
            </div>
        </MokaCard>
    );
};

export default AreaFormDepth2;
