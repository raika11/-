import React, { useState } from 'react';
import moment from 'moment';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { defaultHistorySearchType } from '@pages/commons';

const component = [{ name: '컴포넌트 명' }];
const history = [{ name: '임시저장' }, { name: '전송' }];

/**
 * 데스킹 히스토리 검색 컴포넌트
 */
const DeskingHistorySearch = () => {
    const [search, setSearch] = useState({});
    const handleSearch = () => {};

    return (
        <Form>
            {/* 컴포넌트 명 */}
            <MokaInput as="select" className="mb-2" onChange={(e) => e.target.value} value={search}>
                {component.map((comp, idx) => (
                    <option key={idx} value={idx}>
                        {comp.name}
                    </option>
                ))}
            </MokaInput>
            {/* 날짜 검색 */}
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput as="select" className="mb-0" value={search} onChange={(e) => e.target.value}>
                        {history.map((history, idx) => (
                            <option key={idx} value={idx}>
                                {history.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={8} className="p-0">
                    <MokaInputLabel
                        label="날짜"
                        as="dateTimePicker"
                        labelWidth={28}
                        className="mb-0 w-100"
                        inputProps={{
                            timeFormat: null,
                        }}
                        value={moment(search.regDt, DB_DATEFORMAT)}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({
                                    ...search,
                                    regDt: moment(date).format(DB_DATEFORMAT),
                                });
                            } else {
                                setSearch({
                                    ...search,
                                    regDt: null,
                                });
                            }
                        }}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                {/* 검색조건 */}
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        className="mb-0"
                        value={search.searchType || undefined}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                searchType: e.target.value,
                            });
                        }}
                    >
                        {defaultHistorySearchType.map((searchType) => (
                            <option value={searchType.id} key={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                {/* 키워드 */}
                <Col xs={8} className="p-0 mb-0">
                    <MokaSearchInput
                        value={search.keyword}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                keyword: e.target.value,
                            });
                        }}
                        onSearch={handleSearch}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default DeskingHistorySearch;
