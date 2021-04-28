import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { initialState, getNewsLetterPassiveList, getNewsLetterSendList, changeNewsLetterSendSearchOption } from '@store/newsLetter';
import { DB_DATEFORMAT, NEWS_LETTER_TYPE } from '@/constants';
import toast from '@/utils/toastUtil';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 검색
 */
const NewsLetterSendSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ newsLetter }) => newsLetter.send.search);
    const letterList = useSelector(({ newsLetter }) => newsLetter.send.letterList);
    const [search, setSearch] = useState(initialState.send.search);
    const [period, setPeriod] = useState([7, 'days']);
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
            const nd = new Date();
            const startDt = moment(nd).subtract(Number(number), date).startOf('day');
            const endDt = moment(nd).endOf('day');
            setSearch({ ...search, startDt, endDt });
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

        let ns = {
            ...search,
            page: 0,
            startDt: search.startDt ? moment(search.startDt).format(DB_DATEFORMAT) : null,
            endDt: search.endDt ? moment(search.endDt).format(DB_DATEFORMAT) : null,
        };
        dispatch(getNewsLetterSendList(changeNewsLetterSendSearchOption(ns)));
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

    useEffect(() => {
        const date = new Date();
        const startDt = moment(date).subtract(period[0], period[1]).startOf('day').format(DB_DATEFORMAT);
        const endDt = moment(date).endOf('day').format(DB_DATEFORMAT);
        const ns = { ...search, startDt, endDt };

        dispatch(getNewsLetterSendList(getNewsLetterPassiveList(), changeNewsLetterSendSearchOption(ns)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" name="letterType" value={search.letterType} onChange={handleChangeValue}>
                        <option value="">유형 전체</option>
                        {Object.keys(NEWS_LETTER_TYPE).map((lt) => (
                            <option key={lt} value={lt}>
                                {NEWS_LETTER_TYPE[lt]}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <div className="mr-2">
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
                </div>
                <div className="mr-2 d-flex align-items-center">
                    <MokaInput
                        as="dateTimePicker"
                        value={search.startDt}
                        inputProps={{ timeFormat: null, timeDefault: 'start', width: 130 }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startDt: date });
                            } else {
                                setSearch({ ...search, startDt: null });
                            }
                        }}
                    />
                    <p className="mb-0 mx-2">~</p>
                    <MokaInput
                        as="dateTimePicker"
                        value={search.endDt}
                        inputProps={{ timeFormat: null, timeDefault: 'end', width: 130 }}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endDt: date });
                            } else {
                                setSearch({ ...search, endDt: null });
                            }
                        }}
                    />
                </div>
                <MokaInput
                    as="autocomplete"
                    name="letterTitle"
                    className="mr-2 flex-fill"
                    value={nlName}
                    inputProps={{
                        options: letterList,
                        maxMenuHeight: 300,
                        placeholder: '뉴스레터 명 검색',
                    }}
                    onChange={(value) => {
                        setNlName(value);
                        setSearch({ ...search, letterName: value?.value });
                    }}
                />
                <Button variant="searching" className="mr-1" onClick={handleClickSearch}>
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
