import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import toast from '@utils/toastUtil';
import { MokaInputLabel, MokaCard } from '@components';
import { saveArea, changeArea, GET_AREA_DEPTH1, DELETE_AREA, SAVE_AREA } from '@store/area';

const AreaFormDepth1 = ({ onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { domainList, area, loading, areaListDepth2 } = useSelector((store) => ({
        domainList: store.auth.domainList,
        area: store.area.depth1.area,
        areaListDepth2: store.area.depth2.list,
        loading: store.loading[GET_AREA_DEPTH1] || store.loading[DELETE_AREA] || store.loading[SAVE_AREA],
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
     * 저장
     * @param {object} save area데이터
     */
    const handleSave = (save) => {
        dispatch(
            saveArea({
                depth: 1,
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

export default AreaFormDepth1;
