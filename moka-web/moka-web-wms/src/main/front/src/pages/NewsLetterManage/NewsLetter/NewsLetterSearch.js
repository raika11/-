import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@/components';
import { initialState, getNewsLetterList, changeNewsLetterSearchOption } from '@store/newsLetter';
import toast from '@/utils/toastUtil';
import { DB_DATEFORMAT, NEWS_LETTER_TYPE, NEWS_LETTER_SEND_TYPE, NEWS_LETTER_STATUS } from '@/constants';

/**
 * 뉴스레터 관리 > 뉴스레터 상품 검색
 */
const NewsLetterSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ newsLetter }) => newsLetter.newsLetter.search);
    const [search, setSearch] = useState(initialState.newsLetter.search);
    const [period, setPeriod] = useState([7, 'days']);

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
        dispatch(getNewsLetterList(changeNewsLetterSearchOption(ns)));
    };

    /**
     * 초기화
     */
    const handleClickReset = () => {
        setSearch(initialState.newsLetter.search);
        setPeriod([7, 'days']);
    };

    useEffect(() => {
        // 스토어 데이터 로컬에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        const date = new Date();
        const startDt = moment(date).subtract(period[0], period[1]).startOf('day').format(DB_DATEFORMAT);
        const endDt = moment(date).endOf('day').format(DB_DATEFORMAT);
        const ns = { ...search, startDt, endDt };

        dispatch(getNewsLetterList(changeNewsLetterSearchOption(ns)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <MokaInput as="select" name="letterType" className="mr-2" value={search.letterType} onChange={handleChangeValue}>
                    <option value="">유형 전체</option>
                    {Object.keys(NEWS_LETTER_TYPE).map((lt) => (
                        <option key={lt} value={lt}>
                            {NEWS_LETTER_TYPE[lt]}
                        </option>
                    ))}
                </MokaInput>
                <MokaInput as="select" name="category" className="mr-2" value={search.category} onChange={handleChangeValue}>
                    <option value="">카테고리 전체</option>
                    <option value="1">분야1</option>
                    <option value="2">분야2</option>
                    <option value="3">분야3</option>
                </MokaInput>
                <MokaInput as="select" name="status" className="mr-2" value={search.status} onChange={handleChangeValue}>
                    <option value="">상태 전체</option>
                    {Object.keys(NEWS_LETTER_STATUS).map((s) => (
                        <option key={s} value={s}>
                            {NEWS_LETTER_STATUS[s]}
                        </option>
                    ))}
                </MokaInput>
                <MokaInput as="select" name="sendType" className="mr-2" value={search.sendType} onChange={handleChangeValue}>
                    <option value="">발송 방법 전체</option>
                    {Object.keys(NEWS_LETTER_SEND_TYPE).map((st) => (
                        <option key={st} value={st}>
                            {NEWS_LETTER_SEND_TYPE[st]}
                        </option>
                    ))}
                </MokaInput>
                <MokaInput as="select" name="scbYn" className="mr-2" style={{ width: 140 }} value={search.scbYn} onChange={handleChangeValue}>
                    <option>전용 상품 여부 전체</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                </MokaInput>
                <MokaInput as="select" name="abtestYn" style={{ width: 140 }} className="mr-2" value={search.abtestYn} onChange={handleChangeValue}>
                    <option>A/B TEST 유무 전체</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                </MokaInput>
                <Button variant="negative" style={{ overflow: 'visible' }} onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
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
                    </MokaInput>
                </Col>
                <Col xs={5} className="p-0 pr-2 d-flex align-items-center">
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
                    <p className="mb-0 mx-2">~</p>
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
                <MokaSearchInput
                    name="letterName"
                    className="flex-fill"
                    placeholder="뉴스레터 명을 입력하세요"
                    value={search.letterName}
                    onChange={handleChangeValue}
                    onSearch={handleClickSearch}
                />
            </Form.Row>
        </Form>
    );
};

export default NewsLetterSearch;
