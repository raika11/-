import React, { useState } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 검색
 */
const NewsLetterSendSearch = ({ match }) => {
    const history = useHistory();
    const [search, setSearch] = useState({
        startDt: null,
        endDt: null,
        newsLetterNm: '',
    });
    const [period, setPeriod] = useState([0, 'days']);
    const [nlName, setNlName] = useState([]);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'period') {
            // 기간 설정
            const { number, date } = e.target.selectedOptions[0].dataset;
            setPeriod([Number(number), date]);

            const nd = new Date();
            const startDt = moment(nd).subtract(Number(number), date).startOf('day');
            const endDt = moment(nd).endOf('day');
            setSearch({ ...search, startDt, endDt });
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 뉴스레터 발송
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" name="period" value={period.join('')} onChange={handleChangeValue}>
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
                    name="newsLetterNm"
                    className="mr-2 flex-fill"
                    value={nlName}
                    inputProps={{
                        options: [
                            { value: '001', label: '정치 언박싱' },
                            { value: '002', label: '팩플' },
                            { value: '003', label: '백성호의 현문우답' },
                        ],
                        maxMenuHeight: 300,
                        placeholder: '뉴스레터 명 검색',
                    }}
                    onChange={(value) => {
                        setNlName(value);
                        setSearch({ ...search, newsLetterNm: value?.value });
                    }}
                />
                <Button variant="searching">검색</Button>
            </Form.Row>

            <Form.Row className="justify-content-end">
                <Button variant="positive" className="mr-1" onClick={handleClickAdd}>
                    뉴스레터 발송
                </Button>
                <Button variant="outline-neutral" className="mr-1">
                    아카이브 확인
                </Button>
                <Button variant="outline-neutral">Excel 다운로드</Button>
            </Form.Row>
        </Form>
    );
};

export default NewsLetterSendSearch;
