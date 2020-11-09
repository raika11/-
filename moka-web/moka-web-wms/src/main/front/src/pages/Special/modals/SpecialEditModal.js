import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaModal, MokaInput, MokaInputLabel } from '@components';

const SpecialEditModal = (props) => {
    const { show, onHide } = props;

    // ref
    const imgFileRef = useRef(null);

    return (
        <MokaModal
            size="xl"
            show={show}
            onHide={onHide}
            bodyClassName={`p-10`}
            title="특별페이지 정보"
            width={970}
            buttons={[
                {
                    text: '저장',
                    variant: 'primary',
                    onClick: onHide,
                },
                {
                    text: '삭제',
                    variant: 'gray150',
                    onClick: onHide,
                },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Row>
                    <Col xs={4}>
                        <MokaInputLabel ref={imgFileRef} label="이미지 등록" as="imageFile" />
                        <Form.Row className="d-flex justify-content-between">
                            <Button variant="dark" size="sm">
                                파일 선택
                            </Button>
                            <Button variant="dark" size="sm">
                                이미지 편집
                            </Button>
                        </Form.Row>
                    </Col>
                    <Col xs={8}>
                        <Form.Row>
                            <Col xs={3}>
                                <MokaInput as="checkbox" />
                            </Col>
                            <Col xs={3}>
                                <MokaInput as="checkbox" />
                            </Col>
                            <Col xs={3}>
                                <MokaInput as="checkbox" />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={6}>
                                <MokaInputLabel label="페이지 코드" as="select" value={null} name="pageCd" />
                            </Col>
                            <Col xs={6}>
                                <MokaInputLabel label="새로 만들기" value={null} name="create" />
                            </Col>
                        </Form.Row>
                        <MokaInputLabel label="검색 키워드" value={null} name="keyword" />
                        <Form.Row>
                            <Col xs={8}>
                                <MokaInputLabel label="제목" required value={null} name="title" />
                            </Col>
                            <Col xs={4}>
                                <MokaInputLabel label="회차" required value={null} name="number" />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={6}>
                                <MokaInputLabel label="서비스 시작일" as="dateTimePicker" value={null} name="title" />
                            </Col>
                            <Col xs={6}>
                                <MokaInputLabel label="서비스 종료일" as="dateTimePicker" value={null} name="title" />
                            </Col>
                        </Form.Row>
                        <MokaInputLabel label="PC URL" value={null} name="pcUrl" />
                        <MokaInputLabel label="Mobile URL" value={null} name="mobileUrl" />
                    </Col>
                </Form.Row>
                <MokaInputLabel label="중계페이지 URL" value={null} name="relayUrl" />
                <MokaInputLabel
                    label="광고추척 PC URL"
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                    value={null}
                    name="adPcUrl"
                />
                <MokaInputLabel
                    label="광고추적 Mobile URL"
                    placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) http://dgate.opap.co.kr/imp/?ssn=566&adsn=7478&cresn=5362`}
                    value={null}
                    name="adMobileUrl"
                />
                <MokaInputLabel label="구글 업로드 코드" placeholder={`입력이 없을 경우 공통 소스로 수정됩니다. ex) UA-40895666-10`} value={null} name="googleCode" />
                <MokaInputLabel label="페이지 설명" as="textarea" value={null} name="discription" />
                <Form.Row>
                    <Col xs={1}>
                        <MokaInputLabel label="부서명" value={null} name="department" />
                    </Col>
                    <Col xs={2}>
                        <MokaInput as="select" className="m-0" value={null} onChange={null} name="selectDt" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={1}>
                        <MokaInputLabel label="개발 담당자 이름" value={null} name="manager" />
                    </Col>
                    <Col xs={4}>
                        <MokaInputLabel label="이메일" value={null} name="email" />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel label="전화번호" value={null} name="phone" />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={1}>
                        <MokaInputLabel label="등록자" value={null} name="registrant" />
                    </Col>
                    <Col xs={4}>
                        <MokaInputLabel label="등록일시" value={null} name="regDt" />
                    </Col>
                </Form.Row>
            </Form>
        </MokaModal>
    );
};

export default SpecialEditModal;
