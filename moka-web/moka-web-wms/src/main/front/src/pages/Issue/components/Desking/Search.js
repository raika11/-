import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState } from '@store/issue';
import ServiceCodeSelector from './ServiceCodeSelector';

/**
 * 홈 섹션편집 > 패키지 목록 > 패키지 검색
 */
const Search = (props) => {
    const { onChangeSearchOption, search, period, onReset, onSearch, loading, pkgDiv = [] } = props;

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
        onChangeSearchOption({ key: 'period', number, date, value: e.target.value });
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => {
        if (date !== '') {
            onChangeSearchOption({ key: 'startDt', value: date });
        } else {
            onChangeSearchOption({ key: 'startDt', value: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (date !== '') {
            onChangeSearchOption({ key: 'endDt', value: date });
        } else {
            onChangeSearchOption({ key: 'endDt', value: null });
        }
    };

    /**
     * 카테고리 변경
     * @param {string} category 카테고리(text)
     */
    const handleChangeCategory = (category) => {
        onChangeSearchOption({ key: 'category', value: category });
    };

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                {/* 검색기간 */}
                <div style={{ width: 78 }} className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="period" onChange={handleChangePeriod} value={period.join('')}>
                        <option value="">선택</option>
                        <option value="1days" data-number="1" data-date="days">
                            1일
                        </option>
                        <option value="7days" data-number="7" data-date="days">
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
                <div style={{ width: 140 }} className="flex-shrink-0 mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'start', width: 140 }} onChange={handleChangeSDate} value={search.startDt} />
                </div>

                {/* 종료일 */}
                <div style={{ width: 140 }} className="flex-shrink-0 mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'end', width: 140 }} onChange={handleChangeEDate} value={search.endDt} />
                </div>

                {/* 카테고리 */}
                <ServiceCodeSelector value={search.category} className="flex-fill mr-2" onChange={handleChangeCategory} loading={loading} />

                {/* 초기화 */}
                <Button variant="negative" className="flex-shrink-0" onClick={onReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="d-flex justify-content-between">
                {/* 패지키 유형 (이슈, 토픽, 연재) */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="div" value={search.div} onChange={handleChangeValue}>
                        <option value="all">유형 전체</option>
                        {pkgDiv.map((code) => (
                            <option key={code.code} value={code.code}>
                                {code.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 구독 전체 */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="scbYn" value={search.scbYn} onChange={handleChangeValue}>
                        {initialState.scbYnSearchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 키워드 */}
                <MokaSearchInput className="flex-fill" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={onSearch} />
            </Form.Row>
        </Form>
    );
};

export default Search;
