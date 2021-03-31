import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';

/**
 * 홈 섹션편집 > 패키지 목록 > 패키지 검색
 */
const Search = (props) => {
    const { onChangeSearchOption, search, period, onReset, onSearch } = props;

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => onChangeSearchOption({ key: e.target.name, value: e.target.value });

    /**
     * 기간 변경
     * @param {object} e 이벤트
     */
    const handleChangePeriod = (e) => {
        const { number, date } = e.target.selectedOptions[0].dataset;
        onChangeSearchOption({ key: 'period', number, date });
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => {
        if (date !== '') {
            onChangeSearchOption({ key: 'startServiceDay', value: date });
        } else {
            onChangeSearchOption({ key: 'startServiceDay', value: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (date !== '') {
            onChangeSearchOption({ key: 'endServiceDay', value: date });
        } else {
            onChangeSearchOption({ key: 'endServiceDay', value: null });
        }
    };

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div style={{ width: 78 }} className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="period" onChange={handleChangePeriod} value={period.join('')}>
                        <option value="2days" data-number="2" data-date="days">
                            1일
                        </option>
                        <option value="3days" data-number="3" data-date="days">
                            7일
                        </option>
                        <option value="1months" data-number="1" data-date="months">
                            1개월
                        </option>
                        <option value="3months" data-number="3" data-date="months">
                            3개월
                        </option>
                    </MokaInput>
                </div>

                {/* 시작일 */}
                <div className="mr-2">
                    <MokaInput
                        as="dateTimePicker"
                        inputProps={{ timeFormat: null, timeDefault: 'start', width: 140 }}
                        onChange={handleChangeSDate}
                        value={search.startServiceDay}
                    />
                </div>

                {/* 종료일 */}
                <div className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'end', width: 140 }} onChange={handleChangeEDate} value={search.endServiceDay} />
                </div>

                {/* 카테고리 */}
                <MokaInput placeholder="카테고리 전체" className="mr-2" disabled />

                {/* 초기화 */}
                <Button variant="negative" className="flex-shrink-0" onClick={onReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="d-flex mb-14 justify-content-between">
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" disabled>
                        <option>유형 전체</option>
                    </MokaInput>
                </div>

                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" disabled>
                        <option>구독 전체</option>
                    </MokaInput>
                </div>

                {/* 키워드 */}
                <MokaSearchInput className="flex-fill" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={onSearch} />
            </Form.Row>
        </Form>
    );
};

export default Search;
