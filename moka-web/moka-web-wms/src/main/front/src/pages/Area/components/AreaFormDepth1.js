import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { MokaInputLabel } from '@components';

const AreaForm1Depth = () => {
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
        }
    };

    useEffect(() => {
        setTemp(area);
        setDomain(area.domain);
    }, [area]);

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
                <MokaInputLabel className="mb-2" as="select" label="도메인" labelWidth={87} value={domain.domainId}>
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domianId}>
                            {domain.domainUrl}
                        </option>
                    ))}
                </MokaInputLabel>

                {/* 버튼 그룹 */}
                <Card.Footer className="d-flex justify-content-center">
                    <Button className="mr-10">저장</Button>
                    <Button variant="gray150">취소</Button>
                </Card.Footer>
            </Col>
        </div>
    );
};

export default AreaForm1Depth;
