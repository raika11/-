import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { initialState } from '@store/newsLetter';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 검색
 */
const NewsLetterSendSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ newsLetter }) => newsLetter.send.search);
    const [search, setSearch] = useState(initialState.send.search);
    const [period, setPeriod] = useState([0, 'days']);
    const [nlName, setNlName] = useState([]);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'period') {
            const { number, date } = e.target.selectedOptions[0].dataset;
            setPeriod([Number(number), date]);

            // 기간 설정
            if (date === 'all') {
                setSearch({ ...search, startDt: null, endDt: null });
                return;
            } else {
                const nd = new Date();
                const startDt = moment(nd).subtract(Number(number), date).startOf('day');
                const endDt = moment(nd).endOf('day');
                setSearch({ ...search, startDt, endDt });
            }
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch(initialState.send.search);
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="period" value={period.join('')} onChange={handleChangeValue}>
                        <option value="all" data-number="0" data-date="all">
                            기간 전체
                        </option>
                        <option value="7days" data-number="7" data-date="days">
                            1주
                        </option>
                        <option value="1months" data-number="1" data-date="months">
                            1개월
                        </option>
                        <option value="3months" data-number="3" data-date="months">
                            3개월
                        </option>
                        <option value="6months" data-number="6" data-date="months">
                            6개월
                        </option>
                        <option value="1years" data-number="1" data-date="years">
                            1년
                        </option>
                    </MokaInput>
                </Col>
                <Col xs={5} className="p-0 pr-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        value={search.startDt}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startDt: date });
                            } else {
                                setSearch({ ...search, startDt: null });
                            }
                        }}
                    />
                    <p className="mb-0 mx-2 d-flex align-items-center">~</p>
                    <MokaInput
                        as="dateTimePicker"
                        value={search.endDt}
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endDt: date });
                            } else {
                                setSearch({ ...search, endDt: null });
                            }
                        }}
                    />
                </Col>
                <MokaInput
                    as="autocomplete"
                    name="letterTitle"
                    className="mr-2 flex-fill"
                    value={nlName}
                    inputProps={{
                        options: [
                            { value: '001', label: '정치 언박싱' },
                            { value: '002', label: '팩플' },
                            { value: '003', label: '백성호의 현문우답' },
                            { value: '004', label: '풀인 인사이트' },
                            { value: '005', label: '뉴스다이제스트' },
                            { value: '006', label: '기타 상품' },
                        ],
                        maxMenuHeight: 300,
                        placeholder: '뉴스레터 명 검색',
                    }}
                    onChange={(value) => {
                        setNlName(value);
                        setSearch({ ...search, letterTitle: value?.value });
                    }}
                />
                <Button variant="searching" className="mr-1">
                    검색
                </Button>
                <Button variant="negative" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default NewsLetterSendSearch;
