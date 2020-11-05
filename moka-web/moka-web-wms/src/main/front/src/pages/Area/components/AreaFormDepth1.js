import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { notification } from '@utils/toastUtil';
import { MokaInputLabel } from '@components';
import { saveArea, changeArea } from '@store/area';

const AreaFormDepth1 = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { domainList, area } = useSelector((store) => ({
        domainList: store.auth.domainList,
        area: store.area.area,
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
            domain,
        };
        dispatch(
            saveArea({
                actions: [changeArea(save)],
                callback: ({ header, body }) => {
                    if (header.success) {
                        notification('success', header.message);
                        history.push(`${location.pathname}/${body.areaSeq}`);
                    } else {
                        notification('warning', header.message);
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
                        />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel className="mb-0" labelWidth={87} label="영역코드" value={temp.areaSeq} inputProps={{ readOnly: true }} />
                    </Col>
                </Form.Row>
                {/* 도메인 */}
                <MokaInputLabel className="mb-2" as="select" label="도메인" name="domainId" labelWidth={87} value={domain.domainId} onChange={handleChangeValue}>
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
    );
};

export default AreaFormDepth1;
