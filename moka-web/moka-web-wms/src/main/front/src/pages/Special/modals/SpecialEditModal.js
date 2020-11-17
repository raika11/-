import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInput, MokaInputLabel, MokaImageInput } from '@components';

const SpecialEditModal = (props) => {
    const { show, onHide } = props;

    // ref
    const imgFileRef = useRef(null);

    return (
        <MokaModal
            size="xl"
            show={show}
            onHide={onHide}
            titleAs={
                <div className="w-100 d-flex justify-content-between align-content-end">
                    <div className="d-flex">
                        <p className="m-0">특별페이지 정보</p>
                        <p className="m-0 pl-2">(등록 완료 후 스크립트 오류 체크 꼭 해주세요)</p>
                    </div>
                    <div className="d-flex">
                        <p className="m-0">수정자: 김경수</p>
                        <p className="m-0 pl-2">수정일시: 2020-09-01 오후 4:01:37</p>
                    </div>
                </div>
            }
            width={970}
            buttons={[
                {
                    text: '저장',
                    variant: 'positive',
                    onClick: onHide,
                },
                {
                    text: '삭제',
                    variant: 'negative',
                    onClick: onHide,
                },
            ]}
            bodyClassName="px-5"
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row>
                    <Col xs={4} className="p-0 pr-4">
                        <MokaInputLabel label="이미지 등록" labelWidth={80} labelClassName="d-flex align-items-start" as="none" />
                        <MokaImageInput width={262} height={234} />
                        <Form.Row className="d-flex justify-content-between pt-2">
                            <Button variant="outline-neutral" size="sm">
                                파일 선택
                            </Button>
                            <Button variant="outline-neutral" size="sm">
                                이미지 편집
                            </Button>
                        </Form.Row>
                    </Col>
                    <Col xs={8} className="p-0">
                        <Form.Row className="mb-3 d-flex align-items-center">
                            <Col xs={2} className="p-0 d-flex">
                                <MokaInput as="checkbox" />
                                <MokaInputLabel label="사용여부" labelWidth={80} className="m-0" labelClassName="d-flex align-items-start" as="none" />
                            </Col>
                            <Col xs={2} className="p-0 d-flex">
                                <MokaInput as="checkbox" />
                                <MokaInputLabel label="검색여부" labelWidth={80} className="m-0" labelClassName="d-flex align-items-start" as="none" />
                            </Col>
                            <Col xs={2} className="p-0 d-flex">
                                <MokaInput as="checkbox" />
                                <MokaInputLabel label="리스트 노출" labelWidth={80} className="m-0" labelClassName=" d-flex align-items-start" as="none" />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel label="페이지 코드" labelWidth={100} as="none" />
                            <Col xs={4} className="p-0">
                                <MokaInput as="select" value={null} name="pageCd" />
                            </Col>
                            <MokaInputLabel label="새로 만들기" labelWidth={100} value={null} name="create" />
                        </Form.Row>
                        <MokaInputLabel label="검색 키워드" labelWidth={100} value={null} name="keyword" />
                        <Form.Row>
                            <MokaInputLabel label="제목" labelWidth={100} required as="none" />
                            <Col xs={6} className="p-0">
                                <MokaInput value={null} name="title" />
                            </Col>
                            <MokaInputLabel label="회차" required value={null} name="number" />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel label="서비스 시작일" labelWidth={100} as="dateTimePicker" value={null} name="title" />
                            <Col xs={6} className="p-0">
                                <MokaInputLabel label="서비스 종료일" labelWidth={100} as="dateTimePicker" value={null} name="title" />
                            </Col>
                        </Form.Row>
                        <MokaInputLabel label="PC URL" labelWidth={100} value={null} name="pcUrl" />
                        <MokaInputLabel label="Mobile URL" labelWidth={100} value={null} name="mobileUrl" />
                    </Col>
                </Form.Row>
                <MokaInputLabel label="중계페이지 URL" labelWidth={135} value={null} name="relayUrl" />
                <MokaInputLabel
                    label="광고추척 PC URL"
                    labelWidth={135}
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                    value={null}
                    name="adPcUrl"
                />
                <MokaInputLabel
                    label="광고추적 Mobile URL"
                    labelWidth={135}
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                    value={null}
                    name="adMobileUrl"
                />
                <MokaInputLabel
                    label="구글 업로드 코드"
                    labelWidth={135}
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) UA-40895666-10`}
                    value={null}
                    name="googleCode"
                />
                <MokaInputLabel
                    label={
                        <>
                            페이지 설명 <br /> *&#39;&quot;포함
                            <br />
                            특수문자 사용금지
                        </>
                    }
                    labelWidth={135}
                    as="textarea"
                    value={null}
                    name="discription"
                />
                <Form.Row className="mb-3">
                    <MokaInputLabel label="부서명" labelWidth={135} className="m-0" as="none" />
                    <Col xs={1} className="p-0">
                        <MokaInput value={null} name="department" />
                    </Col>
                    <Col xs={3} className="p-0 pl-3">
                        <MokaInput as="select" value={null} onChange={null} name="selectDt" />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <MokaInputLabel label="개발 담당자 이름" className="m-0" labelWidth={135} as="none" />
                    <Col xs={1} className="p-0">
                        <MokaInput value={null} name="manager" />
                    </Col>
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="이메일" labelWidth={70} className="m-0" value={null} name="email" />
                    </Col>
                    <Col xs={3} className="p-0">
                        <MokaInputLabel label="전화번호" labelWidth={70} className="m-0" value={null} name="phone" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <MokaInputLabel label="등록자" labelWidth={135} className="m-0" as="none" />
                    <Col xs={1} className="p-0">
                        <MokaInput value={null} name="registrant" />
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel label="등록일시" labelWidth={70} className="m-0" value={null} name="regDt" />
                    </Col>
                </Form.Row>
            </Form>
        </MokaModal>
    );
};

export default SpecialEditModal;
