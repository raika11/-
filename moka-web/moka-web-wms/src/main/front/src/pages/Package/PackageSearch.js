import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { CodeAutocomplete } from '@pages/commons';
import { MokaInput, MokaSearchInput } from '@/components';
import { changeKornameSearchOption, getCodeKornameList } from '@store/code';
import { getPackageList } from '@store/package/packageAction';
import { Button } from 'react-bootstrap';

/**
 * 패키지 검색
 */
const PackageSearch = () => {
    const [search, setSearch] = useState({
        masterCode: '',
        type: 'all',
        endYn: 'all',
        subsYn: 'all',
        expoYn: 'all',
        period: [1, 'day'],
        startDt: moment(),
        endDt: moment(),
        keyword: '',
    });

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;

            if (name === 'period') {
                // 기간 설정
                const { number, date } = e.target.selectedOptions[0].dataset;
                setSearch({ ...search, [name]: [Number(number), date] });

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
        setSearch({ masterCode: '', type: 'all', endYn: 'all', subsYn: 'all', expoYn: 'all', period: [1, 'day'], startDt: moment(), endDt: moment(), keyword: '' });
    };

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col xs={12} className="p-0 d-flex">
                    <div style={{ width: 355 }} className="mr-2">
                        <CodeAutocomplete
                            name="masterCode"
                            placeholder="카테고리 선택"
                            value={search.masterCode}
                            onChange={(value) => {
                                handleChangeValue({ target: { name: 'masterCode', value: value.map((code) => code.value).join(',') } });
                            }}
                            isMulti={true}
                        />
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput as="select" className="mr-2" name="type" value={search.type} onChange={handleChangeValue}>
                            <option value="all">유형 전체</option>
                            <option value="topic">토픽</option>
                            <option value="issue">이슈</option>
                            <option value="series">시리즈</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput as="select" className="mr-2" name="endYn" value={search.endYn} onChange={handleChangeValue}>
                            <option value="all">전체</option>
                            <option value="Y">진행</option>
                            <option value="N">종료</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput as="select" className="mr-2" name="subsYn" value={search.subsYn} onChange={handleChangeValue}>
                            <option value="all">전체</option>
                            <option value="Y">구독 상품</option>
                            <option value="N">비구독 상품</option>
                        </MokaInput>
                    </div>
                    <div style={{ width: 120 }} className="mr-2">
                        <MokaInput as="select" className="mr-2" name="expoYn" value={search.expoYn} onChange={handleChangeValue}>
                            <option value="all">전체</option>
                            <option value="Y">노출</option>
                            <option value="N">비노출</option>
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
                    <MokaInput as="select" name="period" value={search.period.join('')} onChange={handleChangeValue}>
                        <option value="day" data-number="1" data-date="days">
                            1일
                        </option>
                        <option value="week" data-number="7" data-date="days">
                            1주일
                        </option>
                        <option value="month" data-number="1" data-date="months">
                            1개월
                        </option>
                        <option value="3month" data-number="3" data-date="months">
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
                    <MokaSearchInput className="w-100" name="keyword" placeholder="이슈명 또는 담당 기자명을 입력하세요" value={search.keyword} onChange={handleChangeValue} />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default PackageSearch;
