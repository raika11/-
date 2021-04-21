import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { initialState } from '@store/newsLetter';
import toast from '@/utils/toastUtil';
// import { DB_DATEFORMAT } from '@/constants';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 검색
 */
const NewsLetterSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ newsLetter }) => newsLetter.newsLetter.search);
    const [search, setSearch] = useState(initialState.newsLetter.search);
    const [period, setPeriod] = useState([0, 'all']);
    const [nlTitle, setNlTitle] = useState([]);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'period') {
            const { number, date } = e.target.selectedOptions[0].dataset;
            setPeriod([Number(number), date]);

            // 기간 설정
            if (number === 0 && date === 'all') {
                setSearch({ ...search, startDt: null, endDt: null });
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
     * 검색
     */
    const handleClickSearch = () => {
        let startDiff = moment(search.startDt).diff(moment(search.endDt));
        let endDiff = moment(search.endDt).diff(moment(search.startDt));
        if (startDiff > 0) {
            toast.warning('시작일은 종료일 보다 클 수 없습니다.');
            return;
        }

        if (endDiff < 0) {
            toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
            return;
        }
    };

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch(initialState.newsLetter.search);
        setPeriod([0, 'all']);
        setNlTitle([]);
    };

    useEffect(() => {
        // 스토어 데이터 로컬에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <MokaInput as="select" name="letterType" className="mr-2" value={search.letterType} onChange={handleChangeValue}>
                    <option value="">유형 전체</option>
                    <option value="O">오리지널</option>
                    <option value="B">브리핑</option>
                    <option value="N">알림</option>
                    <option value="E">기타</option>
                </MokaInput>
                <MokaInput as="select" name="status" className="mr-2" value={search.status} onChange={handleChangeValue}>
                    <option value="">상태 전체</option>
                    <option value="Y">활성</option>
                    <option value="P">임시저장</option>
                    <option value="S">중지</option>
                    <option value="Q">종료</option>
                </MokaInput>
                <MokaInput as="select" name="sendType" className="mr-2" value={search.sendType} onChange={handleChangeValue}>
                    <option value="">발송 방법 전체</option>
                    <option value="A">자동</option>
                    <option value="E">수동</option>
                </MokaInput>
                <MokaInput as="select" name="abtestYn" className="mr-2" value={search.abtestYn} onChange={handleChangeValue}>
                    <option>A/B TEST 여부 전체</option>
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </MokaInput>
                <Button variant="negative" style={{ overflow: 'visible' }} onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="period" value={period.join('')} onChange={handleChangeValue}>
                        <option value="0all" data-number="0" data-date="all">
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
                    className="mr-2 flex-fill"
                    value={nlTitle}
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
                        setNlTitle(value);
                        setSearch({ ...search, letterName: value?.label });
                    }}
                />
                <Button variant="searching" onClick={handleClickSearch}>
                    검색
                </Button>
            </Form.Row>
        </Form>
    );
};

export default NewsLetterSearch;
