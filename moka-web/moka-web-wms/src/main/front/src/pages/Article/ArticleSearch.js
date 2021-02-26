import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import { DB_DATEFORMAT, ARTICLE_SOURCE_LIST_KEY } from '@/constants';
import { initialState, getArticleList, changeSearchOption } from '@store/article';
import { getPressCate1 } from '@store/codeMgt';
import { MokaInput, MokaIcon } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import ArticleSourceSelector from '@pages/Article/components/ArticleSourceSelector';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import toast from '@utils/toastUtil';
import { getLocalItem, setLocalItem } from '@utils/storageUtil';

moment.locale('ko');

/**
 * 등록기사 검색 컴포넌트
 */
const ArticleSearch = ({ ja, sun }) => {
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.article.search);
    const pressCate1Rows = useSelector((store) => store.codeMgt.pressCate1Rows);
    const [search, setSearch] = useState(initialState.search);
    const [sourceList, setSourceList] = useState(ja ? '1,3' : sun ? '61' : getLocalItem(ARTICLE_SOURCE_LIST_KEY));
    const [sourceOn, setSourceOn] = useState(false);
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

            // startServiceDay, endServiceDay 변경
            const nd = new Date();
            const startServiceDay = moment(nd).subtract(Number(number), date).startOf('day');
            const endServiceDay = moment(nd);
            setSearch({ ...search, startServiceDay, endServiceDay });
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 마스터코드 autocomplete 변경
     * @param {string} masterCode 마스터코드
     */
    const handleChangeMasterCode = (masterCode) => {
        setSearch({ ...search, masterCode });
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
        setPeriod([0, 'days']);
        dispatch(
            changeSearchOption({
                ...initialState.search,
                page: search.page,
                startServiceDay: moment(date).subtract(0, 'days').startOf('day').format(DB_DATEFORMAT),
                endServiceDay: moment(date).format(DB_DATEFORMAT),
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
            toast.warning('매체를 하나 이상 선택하세요');
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
            startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
            endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
            page: 0,
        };

        if (validate(ns)) {
            dispatch(changeSearchOption(ns));
            dispatch(getArticleList({ search: ns }));
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
        let ssd = moment(storeSearch.startServiceDay, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.endServiceDay, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearch({
            ...storeSearch,
            startServiceDay: ssd,
            endServiceDay: esd,
        });
    }, [storeSearch]);

    useEffect(() => {
        if (!pressCate1Rows) {
            dispatch(getPressCate1());
        }
    }, [dispatch, pressCate1Rows]);

    useEffect(() => {
        if (sourceList) {
            setSourceOn(true);
        }
    }, [sourceList]);

    useEffect(() => {
        /**
         * 마운트 시 기사목록 최초 로딩
         *
         * 시작일 : 현재일의 자정 - period 설정 일수
         * 종료일 : 현재 시간(시분초o)
         */
        const date = new Date();
        const startServiceDay = moment(date).subtract(period[0], period[1]).startOf('day').format(DB_DATEFORMAT);
        const endServiceDay = moment(date).format(DB_DATEFORMAT);
        const ns = { ...search, sourceList, startServiceDay, endServiceDay, page: 0 };

        dispatch(changeSearchOption(ns));
        if (sourceOn) {
            dispatch(getArticleList({ search: ns }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOn]);

    return (
        <Form>
            <Form.Row className="mb-2">
                {/* 검색기간 */}
                <Col xs={1} className="p-0">
                    <MokaInput as="select" name="period" onChange={handleChangeValue} value={period.join('')}>
                        <option value="0days" data-number="0" data-date="days">
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
                </Col>

                {/* 시작일, 종료일 */}
                <Col xs={4} className="p-0 pl-2 d-flex">
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-1"
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        onChange={handleChangeSDate}
                        value={search.startServiceDay}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        className="ml-1"
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        onChange={handleChangeEDate}
                        value={search.endServiceDay}
                    />
                </Col>

                {/* 면, 판 */}
                <Col xs={2} className="p-0 pl-2 d-flex">
                    <MokaInput placeholder="면" name="pressMyun" className="mr-2" onChange={handleChangeValue} value={search.pressMyun} />
                    <MokaInput placeholder="판" name="pressPan" onChange={handleChangeValue} value={search.pressPan} />
                </Col>

                <Col xs={5} className="p-0 pl-2 d-flex">
                    {/* 출판 카테고리 */}
                    <MokaInput as="select" className="mr-2" name="pressCategory" value={search.pressCategory} onChange={handleChangeValue}>
                        <option value="all">출판 전체</option>
                        {pressCate1Rows &&
                            pressCate1Rows.map((code) => (
                                <option key={code.id} value={code.id}>
                                    {code.name}
                                </option>
                            ))}
                    </MokaInput>

                    {/* 기사타입 */}
                    <MokaInput as="select" name="contentType" onChange={handleChangeValue} value={search.contentType} className="mr-2">
                        {initialState.contentTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>

                    {/* 벌크 */}
                    <div className="flex-shrink-0">
                        <MokaInput as="select" name="bulkYn" onChange={handleChangeValue} value={search.bulkYn}>
                            {initialState.bulkYnList.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                </Col>
            </Form.Row>
            <Form.Row className="mb-14">
                {/* 검색조건 */}
                <Col xs={1} className="p-0">
                    <MokaInput as="select" name="searchType" onChange={handleChangeValue} value={search.searchType}>
                        {initialState.searchTypeList.map((tp) => (
                            <option key={tp.id} value={tp.id}>
                                {tp.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>

                {/* 검색어 */}
                <Col xs={4} className="p-0 pl-2">
                    <MokaInput name="keyword" onChange={handleChangeValue} value={search.keyword} onKeyPress={handleKeyPress} placeholder="검색어를 입력하세요" />
                </Col>

                <Col xs={7} className="p-0 pl-2 d-flex">
                    {/* 분류 전체 */}
                    <CodeAutocomplete placeholder="분류 전체" className="flex-fill mr-2" value={search.masterCode} onChange={handleChangeMasterCode} />

                    {/* 매체 */}
                    {!ja && !sun && (
                        <ArticleSourceSelector
                            className="flex-shrink-0 mr-1"
                            value={sourceList}
                            onChange={(value) => {
                                setSourceList(value);
                                setError({ ...error, sourceList: false });
                                if (value !== '') {
                                    // 로컬스토리지에 저장
                                    setLocalItem({ key: ARTICLE_SOURCE_LIST_KEY, value });
                                }
                            }}
                        />
                    )}

                    <Button variant="searching" className="mr-1 flex-shrink-0" onClick={handleSearch}>
                        검색
                    </Button>
                    <Button variant="negative" className="flex-shrink-0" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
            <div className="d-flex mb-14 justify-content-between align-items-end">
                <p className="mb-0">
                    <MokaIcon iconName="fas-circle" className="mr-1 color-info" />
                    벌크전송기사
                </p>
                <div className="d-flex"></div>
            </div>
        </Form>
    );
};

export default ArticleSearch;
