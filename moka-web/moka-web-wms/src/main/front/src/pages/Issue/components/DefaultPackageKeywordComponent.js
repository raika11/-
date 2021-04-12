import React from 'react';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaInputLabel } from '@components';
import Form from 'react-bootstrap/Form';
import commonUtil from '@utils/commonUtil';

const defaultProps = { keyword: {} };

const DefaultPackageKeywordComponent = ({ keyword }) => {
    console.log('keyword', keyword);
    return (
        <Form.Row className="mb-3">
            <Col xs={3} className="p-0">
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 범위" />
                </div>
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 기간" />
                </div>
                <MokaInputLabel as="switch" id="package-kwSearch-switch" label="검색어(N개)" name="kwSearch" inputProps={{ custom: true, checked: keyword.kwSearch === 'Y' }} />
            </Col>
            <Col xs={9} className="p-0">
                <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput as="checkbox" id="package-searchTitle-checkbox" inputProps={{ label: '제목', custom: true }} />
                    </div>
                    <div style={{ width: 80 }}>
                        <MokaInput as="checkbox" id="package-searchTag-checkbox" inputProps={{ label: '태그', custom: true }} />
                    </div>
                </div>
                <div className="mb-3 d-flex align-items-center">
                    <div style={{ width: 228 }} className="pr-3">
                        <MokaInputLabel as="dateTimePicker" label="시작" name="kwStartDt" inputProps={{ timeFormat: null }} value={keyword.sdate} required />
                    </div>
                    <div style={{ width: 80 }} className="pr-1">
                        <MokaInput as="checkbox" id="package-kwEndYn-checkbox" inputProps={{ label: '종료', custom: true, checked: !commonUtil.isEmpty(keyword.edate) }} />
                    </div>
                    <div style={{ width: 150 }}>
                        <MokaInput as="dateTimePicker" name="kwEndDt" value={keyword.kwEndDt} inputProps={{ timeFormat: null }} value={keyword.edate} />
                    </div>
                </div>
                <MokaInput name="keyword" value={keyword.keyword} inputProps={{ isMulti: true, maxMenuHeight: 150 }} />
            </Col>
        </Form.Row>
    );
};

DefaultPackageKeywordComponent.defaultProps = defaultProps;
export default DefaultPackageKeywordComponent;
