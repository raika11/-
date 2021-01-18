import React, { useState } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@components';
import { SourceSelector } from '@pages/commons';

/**
 * 벌크 모니터링 검색
 */
const BulkMonitorSearch = () => {
    const [search, setSearch] = useState();
    const [sourceList, setSourceList] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchType, setSearchType] = useState('');
    const [keyword, setKeyword] = useState('');
    const [error, setError] = useState(false);

    return (
        <>
            <Form className="mb-2">
                <Form.Row>
                    <div className="d-flex align-items-center">
                        <SourceSelector className="mr-2" value={sourceList} sourceType="BULK" onChange={(value) => setSourceList(value)} />

                        {/* 시작일 종료일 */}
                        <div style={{ width: 150 }}>
                            <MokaInput
                                as="dateTimePicker"
                                className="mr-2"
                                inputProps={{ timeFormat: null }}
                                value={startDate}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSearch({
                                            ...search,
                                            startdate: moment(date).format('YYYYMMDD'),
                                        });
                                    } else {
                                        setSearch({
                                            ...search,
                                            startdate: null,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div style={{ width: 150 }}>
                            <MokaInput
                                as="dateTimePicker"
                                className="mr-2"
                                inputProps={{ timeFormat: null }}
                                value={endDate}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setSearch({
                                            ...search,
                                            endDate: moment(date).format('YYYYMMDD'),
                                        });
                                    } else {
                                        setSearch({
                                            ...search,
                                            endDate: null,
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="mr-2" style={{ width: 120 }}>
                            <MokaInput as="select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option value="">전체</option>
                                <option value="seqNo">기사 번호</option>
                                <option value="title">기사 제목</option>
                            </MokaInput>
                        </div>
                        <div className="mr-2" style={{ width: 370 }}>
                            <MokaInput className="mr-2" placeholder="검색어를 입력하세요" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        </div>
                        <MokaInput
                            as="checkbox"
                            className="mr-2"
                            id="bulk-error-checkbox"
                            inputProps={{ label: '오류만 보기', custom: true, checked: error === true }}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setError(true);
                                } else {
                                    setError(false);
                                }
                            }}
                        />
                        <Button variant="searching" className="mr-2">
                            검색
                        </Button>
                        <Button variant="outline-neutral">초기화</Button>
                    </div>
                </Form.Row>
            </Form>
            <div className="d-flex mb-5">
                <p className="mb-0 mr-3">최종 갱신 시간</p>
                <p className="mb-0 mr-3">2021-01-18 08:57:27</p>
                <p className="mb-0 mr-2">[30초 후 갱신]</p>
                <p className="mb-0">커스텀 스위치</p>
            </div>
        </>
    );
};

export default BulkMonitorSearch;
