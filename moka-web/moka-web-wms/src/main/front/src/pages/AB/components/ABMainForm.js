import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel, MokaPrependLinkInput, MokaIcon } from '@components';

/**
 * A/B 테스트 > 탭 > 정보 > 주요 설정폼
 * 공통 UI
 */
const ABMainForm = () => {
    return (
        <div>
            <Form.Row className="mb-2 align-items-center">
                <MokaIcon iconName="fas-circle" fixedWidth className="color-neutral mr-2" />
                <span className="mr-32">대기</span>
                <span>수정일시</span>
            </Form.Row>

            <MokaInputLabel label="매체" className="mb-2" as="select" required disabled>
                <option>매체</option>
            </MokaInputLabel>

            <MokaInputLabel label="설계명" className="mb-2" required disabled />

            <Form.Row className="mb-2">
                <MokaInputLabel label="유형" className="mr-32" disabled />
                <MokaInputLabel label="페이지" className="flex-fill" as="select" required disabled>
                    <option>메인페이지</option>
                </MokaInputLabel>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label="영역" className="mr-32 flex-fill" as="select" disabled required>
                    <option>주요기사-오른쪽</option>
                </MokaInputLabel>
                <MokaInputLabel label="테스트대상" className="flex-fill" as="select" required disabled>
                    <option>디자인</option>
                </MokaInputLabel>
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label="변수 선택" as="none" />
                <MokaPrependLinkInput linkText="ID 235" inputList={{ as: 'autocomplete', options: [], placeholder: '' }} className="mr-32" />
                <MokaPrependLinkInput linkText="ID 236" inputList={{ as: 'autocomplete', options: [], placeholder: '' }} />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="그룹할당" as="radio" id="group-1" name="group" inputProps={{ label: '랜덤그룹' }} className="mr-32" disabled />
                <MokaInput as="radio" id="group-2" name="group" inputProps={{ label: '고정그룹' }} disabled />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <MokaInputLabel label="A그룹" labelWidth={40} className="mr-2" disabled inputProps={{ style: { width: 90 } }} />
                <span className="mr-32">%</span>
                <MokaInputLabel label="B그룹" labelWidth={40} className="mr-2" disabled inputProps={{ style: { width: 90 } }} />
                <span>%</span>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="기간" as="none" />
                <MokaInputLabel label="시작일시" as="dateTimePicker" className="mr-3" required />
                <MokaInput as="checkbox" id="check-enddt" inputProps={{ label: ' ' }} disabled />
                <MokaInputLabel label="종료일시" as="dateTimePicker" inputClassName="right" />
            </Form.Row>

            <Form.Row className="mb-2">
                <MokaInputLabel label=" " as="none" />
                <Col xs={3} className="p-0 align-items-center d-flex">
                    <MokaInput as="checkbox" id="check-time" inputProps={{ label: ' ' }} disabled />
                    <MokaInputLabel label="주기" labelWidth={32} className="mr-2" disabled />
                    <span>분</span>
                </Col>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="목표 달성" as="checkbox" id="check-aim" inputProps={{ label: '기간' }} disabled />
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <div style={{ width: 90 }} className="d-flex align-items-center">
                    <MokaInput as="checkbox" id="check-test" inputProps={{ label: 'KPI 기준' }} disabled />
                </div>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput disabled />
                </div>
                <span className="mr-2">% 클릭수</span>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput disabled />
                </div>
                <span>건 이상일 경우</span>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label=" " as="none" />
                <span className="mr-2" style={{ marginLeft: '22px' }}>
                    시작 후
                </span>
                <div style={{ width: 70 }} className="mr-2">
                    <MokaInput disabled />
                </div>
                <span>분 이후부터 적용</span>
            </Form.Row>

            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="결과반영" as="radio" id="result-1" name="result" inputProps={{ label: '수동반영' }} className="mr-32" disabled />
                <MokaInput as="radio" id="result-2" name="result" inputProps={{ label: '자동반영' }} disabled />
            </Form.Row>

            <MokaInputLabel label="설명" as="textarea" inputProps={{ rows: 3 }} disabled />
        </div>
    );
};

export default ABMainForm;
