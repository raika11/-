import React, { useState } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { defaultHistorySearchType } from '@pages/commons';

const DeskingHistorySearch = () => {
    const [search, setSearch] = useState({});
    const handleSearch = () => {};

    return (
        <Form>
            {/* 날짜 검색 */}
            <Form.Row className="mb-2">
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
