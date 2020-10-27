import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput, MokaCard, MokaInput, MokaInputLabel } from '@components';
import MovePageListModal from './modals/MovePageListModal';

const PageEdit = () => {
    const [moveModalShow, setMoveModalShow] = useState(false);

    return (
        <MokaCard titleClassName="h-100 mb-0 pb-0" title="사이트 정보">
            <Form>
                {/* 버튼 그룹 */}
                <Form.Group className="mb-3">
                    <Button variant="dark" className="mr-05">
                        W3C
                    </Button>
                    <Button variant="dark" className="mr-05">
                        미리보기
                    </Button>
                    <Button variant="info" className="mr-05">
                        즉시반영
                    </Button>
                    <Button variant="secondary" className="mr-05">
                        전송
                    </Button>
                    <Button variant="secondary" className="mr-05">
                        삭제
                    </Button>
                </Form.Group>
                {/* 사용여부 */}
                <MokaInputLabel as="switch" className="mb-2" label="사용여부" id="useYn" inputProps={{ label: '' }} />
                {/* 사이트 ID, URL */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="사이트 ID" className="mb-0" placeholder="ID" />
                    </Col>
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="URL" labelWidth={47} className="mb-0" inputProps={{ plaintext: true }} />
                    </Col>
                </Form.Row>
                {/* 페이지명 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel label="페이지명" className="mb-0 w-100" placeholder="페이지명을 입력하세요" required />
                </Form.Row>
                {/* 서비스명, 서비스타입 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="px-0">
                        <MokaInputLabel label="서비스명" className="mb-0" />
                    </Col>
                    <Col xs={4} className="px-0 pl-2">
                        <MokaInput as="select" className="mb-0">
                            <option>text/html</option>
                        </MokaInput>
                    </Col>
                </Form.Row>
                {/* 표출명, 순서 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="px-0">
                        <MokaInputLabel label="표출명" className="mb-0" />
                    </Col>
                    <Col xs={4} className="px-0">
                        <MokaInputLabel label="순서" labelWidth={43} className="mb-0" required />
                    </Col>
                </Form.Row>
                {/* 이동URL */}
                <Form.Row className="mb-2">
                    <Col xs={4} className="px-0">
                        <MokaInputLabel as="switch" className="mb-0 h-100" id="moveUrl" label="이동URL" />
                    </Col>
                    <Col xs={8} className="px-0">
                        <MokaSearchInput className="pl-2" onSearch={() => setMoveModalShow(true)} disabled />
                    </Col>
                </Form.Row>
                {/* 키워드 */}
                <MokaInputLabel className="mb-2" label="키워드" placeholder="키워드를 입력하세요" />
                {/* 설명 */}
                <MokaInputLabel className="mb-2" inputClassName="resize-none" as="textarea" label="설명" inputProps={{ rows: 10 }} />
                {/* 경로 파라미터명 */}
                <MokaInputLabel
                    className="mb-2"
                    label={
                        <>
                            경로
                            <br />
                            파라미터명
                        </>
                    }
                />
            </Form>

            <MovePageListModal show={moveModalShow} onHide={() => setMoveModalShow(false)} />
        </MokaCard>
    );
};

export default PageEdit;
