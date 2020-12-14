import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import toast, { messageBox } from '@utils/toastUtil';
import { MokaInputLabel, MokaCard } from '@components';
import { saveArea, GET_AREA_DEPTH1, DELETE_AREA, SAVE_AREA } from '@store/area';

const AreaFormDepth1 = ({ onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { area, areaListDepth2 } = useSelector((store) => ({
        area: store.area.depth1.area,
        areaListDepth2: store.area.depth2.list,
    }));
    const domainList = useSelector((store) => store.auth.domainList);
    const loading = useSelector((store) => store.loading[GET_AREA_DEPTH1] || store.loading[DELETE_AREA] || store.loading[SAVE_AREA]);

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
     * 저장
     * @param {object} save area데이터
     */
    const handleSave = (save) => {
        let as = save;
        delete as.areaComp;
        delete as.areaComps;

        dispatch(
            saveArea({
                area: as,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`/area/${body.areaSeq}`);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        const save = {
            ...temp,
            container: null,
            page: null,
            parent: null,
            areaComps: [],
            domain,
        };

        if (areaListDepth2.length > 0 && save.usedYn === 'N') {
            messageBox.confirm(
                '하위 뎁스 메뉴도 편집 영역에 노출되지 않습니다.\n사용여부를 off 하시겠습니까?',
                () => handleSave(save),
                () => {},
            );
        } else {
            handleSave(save);
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        onDelete(temp);
    };

    useEffect(() => {
        setTemp(area);
        setDomain(area.domain);
    }, [area]);

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
                        <Col xs={8} className="p-0 pr-2">
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
                        <option hidden>도메인을 선택하세요</option>
                        {domainList.map((d) => (
                            <option key={d.domainId} value={d.domainId}>
                                {d.domainName} ({d.domainUrl})
                            </option>
                        ))}
                    </MokaInputLabel>

                    {/* 버튼 그룹 */}
                    <Card.Footer className="d-flex justify-content-center">
                        <Button className="mr-10" variant="positive" onClick={handleClickSave}>
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

export default AreaFormDepth1;
