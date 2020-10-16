import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput } from '@components';

/**
 * 템플릿 정보/수정 컴포넌트
 */
const TemplateEdit = () => {
    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="템플릿 정보">
            <Form>
                <Form.Group className="mb-3 d-flex justify-content-between">
                    <div className="d-flex">
                        <Button variant="dark" className="mr-05">
                            컴포넌트 생성
                        </Button>
                        <Button variant="dark">복사</Button>
                    </div>
                    <div className="d-flex">
                        <Button variant="primary" className="mr-05">
                            저장
                        </Button>
                        <Button variant="danger">삭제</Button>
                    </div>
                </Form.Group>
                <MokaInput label="템플릿ID" />
                <MokaInput label="템플릿명" placeholder="템플릿명을 입력하세요" />
                <MokaInput required label="위치 그룹" type="select">
                    <option>템플릿 위치설정</option>
                </MokaInput>
                <Form.Group as={Row}>
                    <Col xs={6} className="d-flex p-0 m-0">
                        <MokaInput label="사이즈" type="select">
                            <option>사이즈</option>
                        </MokaInput>
                    </Col>
                    <Col xs={6} className="d-flex p-0">
                        <MokaInput label="이미지" labelWidth={46} className="pr-1" /> X <MokaInput label=" " labelWidth={10} />
                    </Col>
                </Form.Group>
            </Form>
        </MokaCard>
    );
};

export default TemplateEdit;
