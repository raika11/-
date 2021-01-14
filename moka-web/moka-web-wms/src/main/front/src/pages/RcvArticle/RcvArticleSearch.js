import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, getRcvArticleList, changeSearchOption } from '@store/rcvArticle';
import { MokaInput, MokaSearchInput } from '@components';
import ArticleSourceSelector from '@pages/Article/components/ArticleSourceSelector';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { getLocalItem, setLocalItem } from '@utils/storageUtil';

moment.locale('ko');
const SOURCE_LIST_KEY = 'rcvArticleSourceList';

/**
 * 수신기사 검색 컴포넌트
 */
const RcvArticleSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.rcvArticle.search);

    // state
    const [search, setSearch] = useState(initialState.search);
    const [sourceOn, setSourceOn] = useState(false);
    const [sourceList, setSourceList] = useState(getLocalItem(SOURCE_LIST_KEY));
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
            const startDay = moment(nd).subtract(Number(number), date);
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
        setPeriod([1, 'days']);
        dispatch(
            changeSearchOption({
                ...initialState.search,
                startDay: moment(date).subtract(1, 'days').format(DB_DATEFORMAT),
                endDay: moment(date).format(DB_DATEFORMAT),
                sourceList,
                page: 0,
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

    /**
     * 키 입력
     * @param {object} e 이벤트
     */
    const handleKeyPress = (e) => {
        // 엔터 기본 동작 막음
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
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
         * 시작일 : 현재 시간(시분초o)
         * 종료일 : 현재 시간(시분초o) - period 설정 일수
         */
        // 임시 데이터 연결함, 실제로는 주석 날짜 사용
        // const date = new Date();
        // const startDay = moment(date).subtract(period[0], period[1]).format(DB_DATEFORMAT);
        // const endDay = moment(date).format(DB_DATEFORMAT);
        const startDay = moment('20200823', 'YYYYMMDD').format(DB_DATEFORMAT);
        const endDay = moment('20200826', 'YYYYMMDD').format(DB_DATEFORMAT);
        const ns = { ...search, sourceList, startDay, endDay, page: 0 };

        dispatch(changeSearchOption(ns));
        if (sourceOn) {
            dispatch(getRcvArticleList({ search: ns }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOn]);

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div className="mr-2">
                    <MokaInput as="select" name="period" className="ft-12 flex-fill" onChange={handleChangeValue} value={period.join('')}>
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
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} onChange={handleChangeSDate} value={search.startDay} />
                </div>

                {/* 종료일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null }} onChange={handleChangeEDate} value={search.endDay} />
                </div>

                {/* 상태 */}
                <div className="mr-2 flex-fill">
                    <MokaInput as="select" name="status" className="mb-0 ft-12" value={search.status} onChange={handleChangeValue}>
                        {initialState.statusList.map((op) => (
                            <option key={op.id} value={op.id}>
                                {op.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 원본/수정만 */}
                <div className="flex-fill mr-2">
                    <MokaInput as="select" name="modify" className="ft-12" value={search.modify} onChange={handleChangeValue}>
                        {initialState.modifyList.map((op) => (
                            <option key={op.id} value={op.id}>
                                {op.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 매체 */}
                <ArticleSourceSelector
                    className="flex-shrink-0 flex-fill"
                    value={sourceList}
                    onChange={(value) => {
                        setSourceList(value);
                        setError({ ...error, sourceList: false });
                        if (value !== '') {
                            // 로컬스토리지에 저장
                            setLocalItem({ key: SOURCE_LIST_KEY, value });
                        }
                    }}
                />
                {/* <div style={{ width: 195 }} className="d-flex ml-2 mr-2">
                
                </div> */}
            </Form.Row>
            <Form.Row className="d-flex mb-2 justify-content-between">
                <MokaSearchInput
                    name="keyword"
                    className="mr-2 flex-fill ft-12"
                    inputClassName="ft-12"
                    buttonClassName="ft-12"
                    value={search.keyword}
                    onChange={handleChangeValue}
                    placeholder="제목을 입력하세요"
                    onSearch={handleSearch}
                />

                <Button variant="negative" className="ft-12 flex-shrink-0" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default RcvArticleSearch;
