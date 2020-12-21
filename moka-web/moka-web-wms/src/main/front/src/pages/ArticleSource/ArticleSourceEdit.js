import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel } from '@/components';

const ArticleSourceEdit = () => {
    return (
        <Form>
            <Form.Row>
                <Col xs={6} className="p-0">
                    <MokaInputLabel label="cp명" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled required />
                    <MokaInputLabel label="소스코드" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled required />
                    <MokaInputLabel label="CP 관리자" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="CP 연락처" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="CP 메일" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="XML포맷 출처" labelWidth={100} labelClassName="ft-12" as="select" name="" onChange={(e) => e.target.value} disabled>
                        <option value="all">전체</option>
                    </MokaInputLabel>
                    <MokaInputLabel label="본문 이미지" labelWidth={100} labelClassName="ft-12" as="select" name="" onChange={(e) => e.target.value} disabled>
                        <option value="all">전체</option>
                    </MokaInputLabel>
                    <MokaInputLabel label="업체 IP 정보(구분)" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="FTP 경로" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="기본 URL" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="이미지 URL" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                </Col>
                <Col xs={6} className="p-0">
                    <MokaInputLabel label="CP 타입" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="서버 구분" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="CP 기타" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel label="내부관리자" labelWidth={100} labelClassName="ft-12" name="" onChange={(e) => e.target.value} disabled />
                    <MokaInputLabel
                        label="편집 필요여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch1"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                    <MokaInputLabel
                        label="사용여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch2"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                    <MokaInputLabel
                        label="중앙 사용여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch3"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                    <MokaInputLabel
                        label="JSTORE 사용여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch4"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                    <MokaInputLabel
                        label="CONSALES 사용여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch5"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                    <MokaInputLabel
                        label="일간 사용여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch6"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                    <MokaInputLabel
                        label="소셜 전송여부"
                        labelWidth={120}
                        className="mb-0"
                        labelClassName="mr-3 ft-12"
                        as="switch"
                        name="usedYn"
                        id="switch7"
                        inputProps={{ custom: true }}
                        onChange={(e) => e.target.checked}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ArticleSourceEdit;
