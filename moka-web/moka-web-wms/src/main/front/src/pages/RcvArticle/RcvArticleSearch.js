import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import { SourceSelector } from '@pages/commons';
import { REQUIRED_REGEX } from '@utils/regexUtil';

moment.locale('ko');

const RcvArticleSearch = () => {
    // state
    const [search, setSearch] = useState({});
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [sourceList, setSourceList] = useState(null);
    const [error, setError] = useState({});
    const [period, setPeriod] = useState([2, 'days']);

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'period') {
            // 기간 설정
            const { number, date } = e.target.selectedOptions[0].dataset;
            setPeriod([Number(number), date]);

            // startServiceDay, endServiceDay 변경
            const nd = new Date();
            const startServiceDay = moment(nd).subtract(Number(number), date);
            const endServiceDay = moment(nd);
            setSearch({ ...search, startServiceDay, endServiceDay });
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, startServiceDay: date });
        } else if (date === '') {
            setSearch({ ...search, startServiceDay: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, endServiceDay: date });
        } else if (date === '') {
            setSearch({ ...search, endServiceDay: null });
        }
    };

    /**
     * 초기화 버튼
     * @param {object} e event
     */
    const handleClickReset = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const date = new Date();

        // dispatch(
        //     changeSearchOption({
        //         ...initialState.search,
        //         masterCode: selectedComponent.masterCode || null,
        //         startServiceDay: moment(date).add(-24, 'hours').format(DB_DATEFORMAT),
        //         endServiceDay: moment(date).format(DB_DATEFORMAT),
        //         page: 0,
        //     }),
        // );
    };

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div className="mr-2">
                    <MokaInputLabel
                        as="select"
                        name="period"
                        label="수신일자"
                        labelWidth={50}
                        className="mb-0"
                        inputClassName="ft-12"
                        onChange={handleChangeValue}
                        value={period.join('')}
                    >
                        <option value="2days" data-number="2" data-date="days">
                            1일
                        </option>
                        <option value="3days" data-number="3" data-date="days">
                            3일
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
                    </MokaInputLabel>
                </div>

                {/* 시작일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputClassName="ft-12" inputProps={{ timeFormat: null }} onChange={handleChangeSDate} value={search.startServiceDay} />
                </div>

                {/* 종료일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputClassName="ft-12" inputProps={{ timeFormat: null }} onChange={handleChangeEDate} value={search.endServiceDay} />
                </div>

                {/* 섹션 전체 */}
                <div style={{ width: 110 }} className="mr-2">
                    <MokaInput as="select" name="section" className="ft-12" value={search.searchType} onChange={handleChangeValue}>
                        {['경제', '국제', '기타', '문화', '북한', '사회', '스포츠/레저', '정치', '지방'].map((section) => (
                            <option key={section} value={section}>
                                {section}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 상태 */}
                <div style={{ width: 145 }} className="mr-2">
                    <MokaInputLabel
                        as="select"
                        name="status"
                        label="상태"
                        labelWidth={25}
                        className="mb-0"
                        inputClassName="ft-12"
                        value={search.searchType}
                        onChange={handleChangeValue}
                    >
                        <option>작업전</option>
                        <option>등록</option>
                    </MokaInputLabel>
                </div>

                {/* 원본/수정만 */}
                <div style={{ width: 110 }}>
                    <MokaInput as="select" name="original" className="ft-12" value={search.searchType} onChange={handleChangeValue}>
                        <option>원본만</option>
                        <option>수정만</option>
                    </MokaInput>
                </div>
            </Form.Row>
            <Form.Row className="d-flex mb-2 justify-content-between">
                {/* 제목 */}
                <MokaInputLabel name="title" label="제목" labelWidth={50} className="mb-0 flex-fill" value={search.searchType} onChange={handleChangeValue} />

                {/* 매체 */}
                <div style={{ width: 195 }} className="ml-2">
                    <SourceSelector
                        value={sourceList}
                        onChange={(value) => {
                            setSourceList(value);
                            setError({ ...error, sourceList: false });
                        }}
                        isInvalid={error.sourceList}
                    />
                </div>
            </Form.Row>
            <Form.Row className="d-flex mb-2 justify-content-end">
                <Button variant="searching" className="mr-2" onClick={() => setModalShow(true)}>
                    검색
                </Button>

                <Button variant="negative" className="ft-12" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default RcvArticleSearch;
