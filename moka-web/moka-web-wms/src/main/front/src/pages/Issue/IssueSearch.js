import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaSearchInput } from '@/components';
import { Button } from 'react-bootstrap';
import { initialState } from '@store/issue';
import produce from 'immer';
import ServiceCodeSelector from '@pages/Issue/components/Desking/ServiceCodeSelector';

/**
 * 패키지 검색
 */
const IssueSearch = ({ onSearch, searchOptions }) => {
    const [search, setSearch] = useState(initialState.search);
    const [period, setPeriod] = useState([1, 'days']);

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        ({ name, value, selectedOptions }) => {
            if (name === 'period') {
                // 기간 설정
                const { number, date } = selectedOptions[0].dataset;
                setPeriod([Number(number), date]);

                // startDay, endDay 변경
                const nd = new Date();
                const startDt = moment(nd).subtract(Number(number), date);
                const endDt = moment(nd);
                setSearch({ ...search, startDt, endDt });
            } else if (name === 'masterCode') {
                setSearch({ ...search, masterCode: value });
            } else {
                setSearch({ ...search, [name]: value });
            }
        },
        [search],
    );

    const handleClickReset = () => {
        //setSearch({ masterCode: '', type: 'all', endYn: 'all', subsYn: 'all', expoYn: 'all', period: [1, 'day'], startDt: moment(), endDt: moment(), keyword: '' });
        setSearch(initialState.search);
        setPeriod([1, 'days']);
    };

    const handleClickSearch = () => {
        if (onSearch instanceof Function) {
            onSearch(
                produce(search, (draft) => {
                    draft['page'] = 0;
                }),
            );
        }
    };

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0 d-flex">
                    <div style={{ width: 430 }} className="mr-2">
                        {/*<CodeAutocomplete
                            name="category"
                            placeholder="카테고리 선택"
                            value={search.category}
                            onChange={(value) => {
                                handleChangeValue({ target: { name: 'category', value: value.map((code) => code.value).join(',') } });
                            }}
                            isMulti={true}
                        />*/}
                        <ServiceCodeSelector
                            value={search.category}
                            onChange={(data) => {
                                handleChangeValue({ name: 'category', value: data });
                            }}
                        />
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput
                            as="select"
                            className="mr-2"
                            name="div"
                            value={search.div}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            <option value="all">유형 전체</option>
                            <option value="T">토픽</option>
                            <option value="I">이슈</option>
                            <option value="S">시리즈</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput
                            as="select"
                            className="mr-2"
                            name="usedYn"
                            value={search.usedYn}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            <option value="all">전체</option>
                            <option value="Y">노출</option>
                            <option value="N">비노출</option>
                            <option value="N">종료</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput
                            as="select"
                            className="mr-2"
                            name="scbYn"
                            value={search.scbYn}
                            onChange={(e) => {
                                handleChangeValue(e.target);
                            }}
                        >
                            <option value="all">전체</option>
                            <option value="Y">구독 상품</option>
                            <option value="N">비구독 상품</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 61.5 }}>
                        <Button variant="negative" onClick={handleClickReset}>
                            초기화
                        </Button>
                    </div>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        name="period"
                        value={period.join('')}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                    >
                        <option value="1days" data-number="0" data-date="days">
                            1일
                        </option>
                        <option value="7days" data-number="7" data-date="days">
                            1주일
                        </option>
                        <option value="1months" data-number="1" data-date="months">
                            1개월
                        </option>
                        <option value="3months" data-number="3" data-date="months">
                            3개월
                        </option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-2"
                        name="startDt"
                        inputProps={{ timeFormat: null }}
                        value={search.startDt}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startDt: date });
                            } else if (date === '') {
                                setSearch({ ...search, startDt: null });
                            }
                        }}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        name="endDt"
                        inputProps={{ timeFormat: null }}
                        value={search.endDt}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endDt: date });
                            } else if (date === '') {
                                setSearch({ ...search, endDt: null });
                            }
                        }}
                    />
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput
                        className="w-100"
                        name="keyword"
                        placeholder="이슈명 또는 담당 기자명을 입력하세요"
                        value={search.keyword}
                        onChange={(e) => {
                            handleChangeValue(e.target);
                        }}
                        onSearch={handleClickSearch}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default IssueSearch;
