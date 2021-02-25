import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT, RCV_ARTICLE_SOURCE_LIST_KEY } from '@/constants';
import { initialState, getRcvArticleList, changeSearchOption } from '@store/rcvArticle';
import { MokaInput, MokaSearchInput } from '@components';
import ArticleSourceSelector from '@pages/Article/components/ArticleSourceSelector';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { getLocalItem, setLocalItem } from '@utils/storageUtil';

moment.locale('ko');

/**
 * 수신기사 검색
 */
const RcvArticleSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.rcvArticle.search);

    // state
    const [search, setSearch] = useState(initialState.search);
    const [sourceOn, setSourceOn] = useState(false);
    const [sourceList, setSourceList] = useState(getLocalItem(RCV_ARTICLE_SOURCE_LIST_KEY));
    const [error, setError] = useState({});
    const [period, setPeriod] = useState([3, 'months']);

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

            // startDay, endDay 변경
            const nd = new Date();
            const startDay = moment(nd).subtract(Number(number), date).startOf('day');
            const endDay = moment(nd);
            setSearch({ ...search, startDay, endDay });
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
            setSearch({ ...search, startDay: date });
        } else if (date === '') {
            setSearch({ ...search, startDay: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, endDay: date });
        } else if (date === '') {
            setSearch({ ...search, endDay: null });
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
        setPeriod([0, 'days']);
        dispatch(
            changeSearchOption({
                ...initialState.search,
                page: search.page,
                startDay: moment(date).subtract(0, 'days').startOf('day').format(DB_DATEFORMAT),
                endDay: moment(date).format(DB_DATEFORMAT),
                sourceList,
            }),
        );
    };

    /**
     * validate
     */
    const validate = (ns) => {
        let isInvalid = false;

        if (!REQUIRED_REGEX.test(ns.sourceList)) {
            isInvalid = isInvalid || true;
            setError({ ...error, sourceList: true });
        }

        return !isInvalid;
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let ns = {
            ...search,
            sourceList,
            startDay: moment(search.startDay).format(DB_DATEFORMAT),
            endDay: moment(search.endDay).format(DB_DATEFORMAT),
            page: 0,
        };

        if (validate(ns)) {
            dispatch(changeSearchOption(ns));
            dispatch(getRcvArticleList({ search: ns }));
        }
    };

    useEffect(() => {
        let ssd = moment(storeSearch.startDay, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.endDay, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearch({
            ...storeSearch,
            startDay: ssd,
            endDay: esd,
        });
    }, [storeSearch]);

    useEffect(() => {
        if (sourceList) {
            setSourceOn(true);
        }
    }, [sourceList]);

    useEffect(() => {
        /**
         * 마운트 시 기사목록 최초 로딩
         *
         * 시작일 : 현재 일자(자정) - period 설정 일수
         * 종료일 : 현재 시간(시분초o)
         */
        const date = new Date();
        const startDay = moment(date).subtract(period[0], period[1]).startOf('day').format(DB_DATEFORMAT);
        const endDay = moment(date).format(DB_DATEFORMAT);
        const ns = { ...search, sourceList, startDay, endDay, page: 0 };

        dispatch(changeSearchOption(ns));
        if (sourceOn) {
            dispatch(getRcvArticleList({ search: ns }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOn]);

    return (
        <Form className="mb-14">
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="period" onChange={handleChangeValue} value={period.join('')}>
                        <option value="1days" data-number="1" data-date="days">
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
                    </MokaInput>
                </div>

                {/* 시작일 */}
                <div className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'start', width: 140 }} onChange={handleChangeSDate} value={search.startDay} />
                </div>

                {/* 종료일 */}
                <div className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'end', width: 140 }} onChange={handleChangeEDate} value={search.endDay} />
                </div>

                {/* 상태 */}
                <div className="mr-2 flex-fill">
                    <MokaInput as="select" name="status" value={search.status} onChange={handleChangeValue}>
                        {initialState.statusList.map((op) => (
                            <option key={op.id} value={op.id}>
                                {op.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 원본/수정만 */}
                <div className="flex-fill mr-2">
                    <MokaInput as="select" name="modify" value={search.modify} onChange={handleChangeValue}>
                        {initialState.modifyList.map((op) => (
                            <option key={op.id} value={op.id}>
                                {op.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 매체 */}
                <ArticleSourceSelector
                    className="flex-shrink-0"
                    value={sourceList}
                    onChange={(value) => {
                        setSourceList(value);
                        setError({ ...error, sourceList: false });
                        if (value !== '') {
                            // 로컬스토리지에 저장
                            setLocalItem({ key: RCV_ARTICLE_SOURCE_LIST_KEY, value });
                        }
                    }}
                />
            </Form.Row>
            <Form.Row className="d-flex justify-content-between">
                <MokaSearchInput
                    name="keyword"
                    className="mr-1 flex-fill"
                    value={search.keyword}
                    onChange={handleChangeValue}
                    placeholder="제목을 입력하세요"
                    onSearch={handleSearch}
                />

                <Button variant="negative" className="flex-shrink-0" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default RcvArticleSearch;
