import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { CodeAutocomplete } from '@/pages/commons';
import { initialState } from '@store/articleSource';

const CodeMappingEdit = () => {
    const dispatch = useDispatch();
    const mappingSearch = useSelector((store) => store.articleSource.mappingSearch);

    const [search, setSearch] = useState(initialState.mappingSearch);

    useEffect(() => {
        setSearch(mappingSearch);
    }, [mappingSearch]);

    return (
        <div className="d-flex flex-column align-items-center">
            <p>변환 코드 추가: (대소문자 구분합니다)</p>
            <Form.Row>
                <Col xs={8} className="p-0">
                    <MokaInputLabel
                        label="매체 분류 코드"
                        labelWidth={80}
                        labelClassName="ft-12"
                        inputClassName="ft-12"
                        className="mr-2"
                        // value={temp.cpEmail}
                        name="frCode"
                        // onChange={handleChangeValue}
                        disabled
                    />
                </Col>
                <Col xs={3} className="p-0">
                    <Button variant="outline-table-btn">중복 확인</Button>
                </Col>
            </Form.Row>
            <p className="mb-0 ft-12">소분류 코드로 입력해주세요,</p>
            <p className="mb-5 ft-12">마땅한게 없으면 XX 일반코드로(사회일반, 정치일반 등)</p>
            <div style={{ width: 400 }}>
                <CodeAutocomplete
                    label="분류 코드"
                    labelWidth={50}
                    labelClassName="ft-12"
                    name="masterCode"
                    placeholder="분류 선택"
                    value={search.masterCode}
                    onChange={(value) => setSearch({ ...search, masterCode: value })}
                />
            </div>
            {/* <div className="d-flex">
                <Button className="mr-2" variant="positive">
                    등록
                </Button>
                <Button variant="negative">취소</Button>
            </div> */}
            <div className="d-flex mt-5">
                <Button className="mr-2" variant="negative">
                    삭제
                </Button>
                <Button className="mr-2" variant="positive">
                    수정
                </Button>
                <Button variant="negative">취소</Button>
            </div>
        </div>
    );
};

export default CodeMappingEdit;
