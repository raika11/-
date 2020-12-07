import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import { DB_DATEFORMAT, HIST_PUBLISH, HIST_SAVE } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { defaultHistorySearchType } from '@pages/commons';

const status = [
    { id: HIST_PUBLISH, name: '전송 기록' },
    { id: HIST_SAVE, name: '임시저장 기록' },
];

/**
 * 데스킹 히스토리 검색 컴포넌트
 */
const ComponentWorkHistorySearch = (props) => {
    const { search, setSearch, list, onSearch } = props;

    return (
        <Form>
            {/* 컴포넌트 명 */}
            <MokaInput
                as="select"
                className="mb-2 ft-12"
                onChange={(e) => {
                    setSearch({
                        ...search,
                        componentSeq: e.target.value,
                    });
                }}
                value={search.componentSeq || undefined}
            >
                <option hidden>컴포넌트 명</option>
                {list.map((comp) => (
                    <option key={comp.componentSeq} value={comp.componentSeq}>
                        {comp.componentName}
                    </option>
                ))}
            </MokaInput>
            {/* 날짜 검색 */}
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        className="mb-0 ft-12"
                        value={search.status}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                status: e.target.value,
                            });
                        }}
                    >
                        {status.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
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
                        inputClassName="ft-12"
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
                        className="mb-0 ft-12"
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
                        onSearch={onSearch}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ComponentWorkHistorySearch;
