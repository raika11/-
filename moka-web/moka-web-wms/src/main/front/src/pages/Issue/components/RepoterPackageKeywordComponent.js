import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaIcon, MokaInput, MokaInputLabel } from '@components';
import Button from 'react-bootstrap/Button';
import produce from 'immer';

const defaultProps = {
    list: [],
};
const ReporterPackageKeywordForm = ({ list }) => {
    return (
        <>
            <Form.Row className="mb-3">
                <Col xs={3} className="p-0 d-flex align-items-center">
                    <MokaInputLabel as="none" label="검색 범위" />
                </Col>
                <Col xs={9} className="p-0 d-flex align-items-center">
                    <p style={{ width: 130 }} className="mb-0 pr-3">
                        기자명(default)
                    </p>
                    <div style={{ width: 80 }} className="pr-3">
                        <MokaInput as="checkbox" id="package-reporterTitle-checkbox" inputProps={{ label: '제목', custom: true }} />
                    </div>
                    <div style={{ width: 80 }}>
                        <MokaInput as="checkbox" id="package-reporterTag-checkbox" inputProps={{ label: '태그', custom: true }} />
                    </div>
                </Col>
            </Form.Row>
            {list.map(({ reporterSearch, reporterStartDt, reporterOptions, reporterEndDt }, idx) => (
                <Form.Row className="mb-3" key={idx}>
                    <Col xs={3} className="p-0 d-flex">
                        <div style={{ width: 30 }} className="d-flex flex-column justify-content-center align-items-center">
                            <p className="mb-0">{idx + 1}</p>
                            <Button variant="white" className="px-05">
                                <MokaIcon iconName="fal-trash-alt" />
                            </Button>
                        </div>
                        <div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="기자명" />
                            </div>
                            <MokaInputLabel
                                as="switch"
                                id={`package-reporterSearch-switch${idx + 1}`}
                                name="reporterSearch"
                                label="검색어(N개)"
                                inputProps={{ custom: true, checked: reporterSearch === 'Y' }}
                            />
                        </div>
                    </Col>
                    <Col xs={9} className="p-0">
                        <div className="mb-3 d-flex align-items-center">
                            <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                <MokaInputLabel as="dateTimePicker" label="시작" name="reporterStartDt" inputProps={{ timeFormat: null }} value={reporterStartDt} required />
                            </div>
                            <div style={{ width: 80 }} className="pr-1">
                                <MokaInput as="checkbox" inputProps={{ label: '종료', custom: true, checked: reporterOptions['reporterEndYn'] || false }} />
                            </div>
                            <div style={{ width: 150 }}>
                                <MokaInput as="dateTimePicker" value={reporterEndDt} inputProps={{ timeFormat: null }} />
                            </div>
                        </div>
                        <MokaInput as="autocomplete" name="reporterName" className="mb-3" />
                        <MokaInput as="autocomplete" name="keywords" />
                    </Col>
                </Form.Row>
            ))}
        </>
    );
};

ReporterPackageKeywordForm.defaultProps = defaultProps;

export default ReporterPackageKeywordForm;
