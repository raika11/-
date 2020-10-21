import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { MokaCard, MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import AutoDatasetListModal from './modals/AutoDatasetListModal';

/**
 * 데이터셋 정보/수정 컴포넌트
 */
const DatasetEdit = () => {
    const [dataType, setDataType] = useState('desk');
    const [autoListModalShow, setAutoListModalShow] = useState(false);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" width={688} className="mr-10 custom-scroll" title="데이터셋 정보">
            <Form>
                {/* 데이터셋아이디, 버튼그룹 */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel className="mb-0" label="데이터셋ID" value="10111" inputProps={{ plaintext: true, readOnly: true }} />
                    </Col>
                    <Col xs={6} className="p-0 d-flex justify-content-between">
                        <div className="d-flex">
                            <Button variant="dark" className="mr-2">
                                데이터 보기
                            </Button>
                            <Button variant="dark">복사</Button>
                        </div>
                        <div className="d-flex">
                            <Button variant="primary" className="mr-2">
                                저장
                            </Button>
                            <Button variant="danger">삭제</Button>
                        </div>
                    </Col>
                </Form.Row>
                {/* 데이터셋명 */}
                <Form.Row className="mb-2">
                    <Col xs={7} className="p-0">
                        <MokaInputLabel className="mb-0" label="데이터셋명" placeholder="데이터셋명을 입력하세요" />
                    </Col>
                </Form.Row>
                {/* 데이터타입 */}
                <Form.Row className="mb-2">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="radio"
                            className="mb-0 h-100"
                            label="데이터"
                            value="desk"
                            inputProps={{ custom: true, id: 'dataset-type1', label: '수동', name: 'dataType', checked: dataType === 'desk' }}
                            onChange={() => setDataType('desk')}
                        />
                    </Col>
                    <Col xs={1} className="p-0 mr-10">
                        <MokaInput
                            as="radio"
                            className="mb-0 h-100 align-items-center d-flex"
                            value="auto"
                            inputProps={{ custom: true, id: 'dataset-type2', label: '자동', name: 'dataType', checked: dataType === 'auto' }}
                            onChange={() => setDataType('auto')}
                        />
                    </Col>
                    <Col xs={5} className="p-0 d-flex">
                        {dataType === 'auto' && <MokaSearchInput className="w-100" placeholder="데이터를 선택해주세요" onSearch={() => setAutoListModalShow(true)} readOnly />}
                    </Col>
                </Form.Row>
            </Form>

            <hr className="divider" />

            <Card.Title className="mb-2">데이터 설정</Card.Title>
            <div className="d-flex justify-content-center">
                <Col xs={10} className="p-0">
                    <Form>
                        {/* 데이터셋의 파라미터에 따라 변경됨 */}
                        {dataType === 'auto' && (
                            <>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="데이터셋 ID" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="부서" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="분류" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="기자" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="시리즈" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                                <Form.Row className="mb-2">
                                    <MokaInputLabel label="지역" labelWidth={80} className="flex-fill mb-0 mr-2" />
                                    <Button>검색</Button>
                                </Form.Row>
                            </>
                        )}
                        <MokaInputLabel label="설명" as="textarea" labelWidth={80} className="mb-0" inputClassName="resize-none" inputProps={{ rows: 7 }} />
                    </Form>
                </Col>
            </div>

            <AutoDatasetListModal show={autoListModalShow} onHide={() => setAutoListModalShow(false)} />
        </MokaCard>
    );
};

export default DatasetEdit;
