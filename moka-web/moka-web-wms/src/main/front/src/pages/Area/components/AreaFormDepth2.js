import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { ITEM_CP, ITEM_CT } from '@/constants';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput } from '@components';
import { GET_AREA_DEPTH2, saveArea, changeArea } from '@store/area';
import toast from '@utils/toastUtil';

const AreaFormDepth2 = (props) => {
    const { onShowModal, page, onChangeModalDomainId } = props;

    const dispatch = useDispatch();
    const history = useHistory();
    const { domainList, depth1List, areaDepth1, area, loading } = useSelector((store) => ({
        domainList: store.auth.domainList,
        depth1List: store.area.depth1.list,
        areaDepth1: store.area.depth1.area,
        area: store.area.depth2.area,
        loading: store.loading[GET_AREA_DEPTH2],
    }));

    // state
    const [temp, setTemp] = useState({});
    const [parent, setParent] = useState({});
    const [domain, setDomain] = useState({});

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
        }
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        const save = {
            ...temp,
            container: Object.keys(temp.container).length > 0 ? temp.container : null,
            page,
            parent,
            domain,
        };
        console.log(save);

        dispatch(
            saveArea({
                depth: 2,
                actions: [changeArea({ area: save, depth: 2 })],
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`/area/${body.parent.areaSeq}/${body.areaSeq}`);
                    } else {
                        toast.warn(header.message);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        setTemp(area);
    }, [area]);

    useEffect(() => {
        // parent, domain 데이터 셋팅
        if (area.parent.areaSeq) {
            setParent(area.parent);
            setDomain(area.parent.domain);
        } else {
            setParent(areaDepth1);
            setDomain(areaDepth1.domain);
        }
    }, [area.parent, areaDepth1]);

    useEffect(() => {
        // 도메인 변경 시 모달의 도메인 검색조건 변경
        if (domain.domainId) {
            onChangeModalDomainId(domain.domainId);
        }
    }, [domain, onChangeModalDomainId]);

    useEffect(() => {
        // 모달한테 전달받은 page 변경 시 CP, CT 리스트 조회
        // if (page.pageSeq) {
        // }
    }, [page]);

    return (
        <MokaCard title={`편집영역 ${area.areaSeq ? '정보' : '등록'}`} className="flex-fill" loading={loading}>
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
                                disabled={parent.areaSeq ? true : false}
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
                                <option key={ITEM_CP}>컴포넌트</option>
                                <option key={ITEM_CT}>컨테이너</option>
                            </MokaInput>
                        </Col>
                        <Col xs={8} className="p-0 pl-2 pr-2">
                            <MokaInput as="select">
                                <option>선택</option>
                            </MokaInput>
                        </Col>
                        <Col xs={2} className="p-0">
                            <MokaInput as="select">
                                <option>일반형</option>
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
