import React, { useState } from 'react';
import moment from 'moment';
// import { useHistory } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 목록 검색
 */
const NewsLetterResultSearch = () => {
    // const history = useHistory();
    const [search, setSearch] = useState({
        sendType: '',
        type: '',
        sendState: '',
        abYn: '',
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

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <MokaInput as="select" name="sendType" className="mr-2" value={search.sendType} onChange={handleChangeValue}>
                    <option value="">발송 방법 전체</option>
                    <option value="A">자동</option>
                    <option value="M">수동</option>
                </MokaInput>
                <MokaInput as="select" name="type" className="mr-2" value={search.type} onChange={handleChangeValue}>
                    <option value="">유형 전체</option>
                    <option value="O">오리지널</option>
                    <option value="B">브리핑</option>
                    <option value="N">알림</option>
                </MokaInput>
                <MokaInput as="select" name="sendState" className="mr-2" value={search.state} onChange={handleChangeValue}>
                    <option value="">발송 상태 전체</option>
                    <option value="C">완료</option>
                    <option value="S">발송 중</option>
                    <option value="R">예약</option>
                </MokaInput>
                <MokaInput as="select" name="abYn" className="mr-2" value={search.abYn} onChange={handleChangeValue}>
                    <option>A/B TEST 유무 전체</option>
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </MokaInput>
                <Button
                    variant="negative"
                    style={{ overflow: 'visible' }}
                    onClick={() => setSearch({ sendType: '', type: '', sendState: '', abYn: '', startDt: null, endDt: null, newsLetterNm: '' })}
                >
                    초기화
                </Button>
            </Form.Row>

            <Form.Row className="mb-2">
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" name="period" value={period.join('')} onChange={handleChangeValue}>
                        <option value="7days" data-number="7" data-date="days">
                            1주
                        </option>
                        <option value="15days" data-number="15" data-date="days">
                            15일
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
        </Form>
    );
};

export default NewsLetterResultSearch;
