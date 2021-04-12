import React from 'react';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SectionPackageKeywordComponent = () => {
    return (
        <Form.Row className="mb-3">
            <Col xs={3} className="p-0">
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 범위" />
                </div>
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 기간" />
                </div>
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="대상 섹션" />
                </div>
                <MokaInputLabel as="switch" id="package-sectionSearch-switch" name="sectionSearch" label="검색어(N개)" inputProps={{ custom: true }} />
            </Col>
            <Col xs={9} className="p-0">
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput as="checkbox" id="package-sectionTitle-checkbox" inputProps={{ label: '제목', custom: true }} />
                    </div>
                    <div style={{ width: 80 }}>
                        <MokaInput as="checkbox" id="package-sectionTag-checkbox" inputProps={{ label: '태그', custom: true }} />
                    </div>
                </div>
                <div className="mb-3 d-flex align-items-center">
                    <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                        <MokaInputLabel as="dateTimePicker" label="시작" name="sectionStartDt" inputProps={{ timeFormat: null }} required />
                    </div>
                    <div style={{ width: 80 }} className="pr-1">
                        <MokaInput as="checkbox" inputProps={{ label: '종료', custom: true }} />
                    </div>
                    <div style={{ width: 150 }}>
                        <MokaInput as="dateTimePicker" name="sectionEndDt" inputProps={{ timeFormat: null }} />
                    </div>
                </div>
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <Button variant="outline-neutral">섹션 선택</Button>
                </div>
                <MokaInput as="autocomplete" name="keywords" inputProps={{ options: [], isMulti: true, maxMenuHeight: 150 }} />
            </Col>
        </Form.Row>
    );
};

export default SectionPackageKeywordComponent;
