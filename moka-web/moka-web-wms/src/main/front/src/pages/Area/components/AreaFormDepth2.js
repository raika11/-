import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ITEM_CP, ITEM_CT } from '@/constants';
import { MokaInputLabel, MokaSearchInput, MokaInput } from '@components';

const AreaFormDepth2 = (props) => {
    const { onShowModal, page } = props;

    const { domainList } = useSelector((store) => ({
        domainList: store.auth.domainList,
    }));

    // state
    const [areaNm, setAreaNm] = useState('');
    const [usedYn, setUsedYn] = useState('N');
    const [previewRsrc, setPreviewRsrc] = useState('');

    return (
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
                        inputProps={{ checked: usedYn === 'Y' }}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setUsedYn('Y');
                            } else {
                                setUsedYn('N');
                            }
                        }}
                    />
                </Form.Row>
                {/* 1depth명 */}
                <Form.Row className="mb-2">
                    <Col xs={8} className="p-0">
                        <MokaInputLabel className="mb-0" as="select" labelWidth={87} label="그룹 영역" placeholder="1뎁스명이 들어가야함">
                            <option>1뎁스 목록</option>
                        </MokaInputLabel>
                    </Col>
                    <Col xs={4} className="p-0">
                        <MokaInputLabel className="mb-0" labelWidth={87} label="영역코드" disabled />
                    </Col>
                </Form.Row>
                {/* 도메인 */}
                <MokaInputLabel className="mb-2" as="select" label="도메인" labelWidth={87}>
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domianId}>
                            {domain.domainUrl}
                        </option>
                    ))}
                </MokaInputLabel>
                {/* 영역명 */}
                <MokaInputLabel className="mb-2" label="영역명" labelWidth={87} value={areaNm} onChange={(e) => setAreaNm(e.target.value)} />

                <hr className="divider" />

                {/* 페이지 검색 */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" className="mb-0" label="페이지" labelWidth={87} disabled />
                    <MokaSearchInput
                        className="w-100"
                        inputClassName="bg-white"
                        variant="dark"
                        value={page.pageSeq ? `${page.pageName} (${page.pageUrl})` : ''}
                        onSearch={() => onShowModal(true)}
                        placeholder="페이지를 선택하세요"
                        disabled
                    />
                </Form.Row>

                {/* 컴포넌트/컨테이너 선택 */}
                <Form.Row className="mb-2">
                    <Col xs={2} className="p-0">
                        <MokaInput as="select">
                            <option key={ITEM_CP}>컴포넌트</option>
                            <option key={ITEM_CT}>컨테이너</option>
                        </MokaInput>
                    </Col>
                    <Col xs={8} className="p-0 pl-2 pr-2">
                        <MokaInput as="select">
                            <option>선택</option>
                        </MokaInput>
                    </Col>
                    <Col xs={2} className="p-0">
                        <MokaInput as="select">
                            <option>일반형</option>
                        </MokaInput>
                    </Col>
                </Form.Row>

                {/* 컨테이너일 경우 하위 컴포넌트 나열 */}

                {/* 미리보기 리소스 */}
                <MokaInputLabel
                    as="textarea"
                    label={
                        <>
                            미리보기
                            <br />
                            리소스
                        </>
                    }
                    labelWidth={87}
                    inputClassName="resize-none"
                    inputProps={{ rows: 5 }}
                    value={previewRsrc}
                    onChange={(e) => setPreviewRsrc(e.target.value)}
                />

                {/* 버튼 그룹 */}
                <Card.Footer className="d-flex justify-content-center">
                    <Button className="mr-10">저장</Button>
                    <Button variant="gray150">취소</Button>
                </Card.Footer>
            </Col>
        </div>
    );
};

export default AreaFormDepth2;
