import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import toast from '@utils/toastUtil';
import { MokaInputLabel, MokaCard } from '@components';
import { saveArea, changeArea, GET_AREA_DEPTH1 } from '@store/area';

const AreaFormDepth1 = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { domainList, area, loading } = useSelector((store) => ({
        domainList: store.auth.domainList,
        area: store.area.depth1.area,
        loading: store.loading[GET_AREA_DEPTH1],
    }));

    // state
    const [temp, setTemp] = useState({});
    const [domain, setDomain] = useState({});

    /**
     * input 값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            if (checked) setTemp({ ...temp, usedYn: 'Y' });
            else setTemp({ ...temp, usedYn: 'N' });
        } else if (name === 'areaNm') {
            setTemp({ ...temp, areaNm: value });
        } else if (name === 'domainId') {
            setDomain({
                domainId: e.target.value,
            });
        }
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        const save = {
            ...temp,
            container: Object.keys(temp.container).length > 0 ? temp.container : null,
            page: Object.keys(temp.page).length > 0 ? temp.page : null,
            parent: Object.keys(temp.parent).length > 0 ? temp.parent : null,
            domain,
        };

        dispatch(
            saveArea({
                actions: [changeArea({ area: save, depth: 1 })],
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`/area/${body.areaSeq}`);
                    } else {
                        toast.warn(header.message);
                    }
                },
            }),
        );
    };

    useEffect(() => {
        setTemp(area);
        setDomain(area.domain);
    }, [area]);

    useEffect(() => {
        if (!domain.domainId) {
            if (domainList.length > 0) {
                setDomain(domainList[0]);
            }
        }
    }, [domain, domainList]);

    return (
        <MokaCard title={`편집영역 ${area.areaSeq ? '정보' : '등록'}`} className="flex-fill" loading={loading}>
            <div className="d-flex justify-content-center">
                <Col xs={10} className="p-0">
                    {/* 사용여부 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel
                            className="mb-0"
                            as="switch"
                            labelWidth={87}
                            label="사용여부"
                            id="usedYn"
                            name="usedYn"
                            inputProps={{ checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Form.Row>
                    {/* 그룹영역명 */}
                    <Form.Row className="mb-2">
                        <Col xs={8} className="p-0">
                            <MokaInputLabel
                                className="mb-0"
                                labelWidth={87}
                                label="그룹 영역명"
                                placeholder="그룹 영역명을 입력하세요"
                                value={temp.areaNm}
                                name="areaNm"
                                onChange={handleChangeValue}
                                required
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <MokaInputLabel className="mb-0" labelWidth={87} label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                        </Col>
                    </Form.Row>
                    {/* 도메인 */}
                    <MokaInputLabel
                        className="mb-2"
                        as="select"
                        label="도메인"
                        name="domainId"
                        labelWidth={87}
                        value={domain.domainId}
                        onChange={handleChangeValue}
                        disabled={temp.areaSeq ? true : false}
                    >
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domianId}>
                                {domain.domainName} ({domain.domainUrl})
                            </option>
                        ))}
                    </MokaInputLabel>

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

export default AreaFormDepth1;
