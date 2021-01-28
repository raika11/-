import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaSearchInput } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import { ChangeArtGroupModal } from '@pages/Article/modals';
import { SourceSelector } from '@pages/commons';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { initialState, getServiceArticleList, getBulkArticleList, changeServiceSearchOption, changeBulkSearchOption, clearServiceList, clearBulkList } from '@store/article';

const defaultProps = {
    isNaverChannel: false,
};

/**
 * 기사 검색
 */
const ArticleDeskSearch = (props) => {
    const { media, selectedComponent, show, isNaverChannel } = props;
    const dispatch = useDispatch();

    // initial setting
    const storeSearch = useSelector(({ article }) => (isNaverChannel ? article.bulk.search : article.service.search));
    const clearList = isNaverChannel ? clearBulkList : clearServiceList;
    const changeSearchOption = isNaverChannel ? changeBulkSearchOption : changeServiceSearchOption;
    const getArticleList = isNaverChannel ? getBulkArticleList : getServiceArticleList;
    const initialSearch = isNaverChannel ? initialState.bulk.search : initialState.service.search;

    // state
    const [search, setSearch] = useState(initialSearch);
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState({});
    const [sourceOn, setSourceOn] = useState(false);
    const [sourceList, setSourceList] = useState(null);
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
     * 그룹지정 넘버 변경한 후 실행
     */
    const onChangeGroupNumber = () => {
        let ns = {
            ...search,
            sourceList,
            startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
            endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
            page: 0,
        };
        dispatch(getArticleList({ search: ns }));
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
     * 분류 변경
     * @param {string} value value
     */
    const handleChangeMasterCode = (value) => {
        setSearch({ ...search, masterCode: value });
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
                ...initialSearch,
                masterCode: selectedComponent.schCodeId || null,
                startServiceDay: moment(date).subtract(0, 'days').startOf('day').format(DB_DATEFORMAT),
                endServiceDay: moment(date).endOf('day').format(DB_DATEFORMAT),
                page: 0,
            }),
        );
    };

    useEffect(() => {
        if (media) setSearchDisabled(true);
    }, [media]);

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
        // 기본 매체가 변경해야되므로 sourceOn = false로 변경
        setSourceOn(false);
    }, [isNaverChannel]);

    useEffect(() => {
        /**
         * 마운트 시 기사목록 최초 로딩
         *
         * 시작일 : 현재 시간(시분초o)
         * 종료일 : 현재 시간(시분초o) - period 설정 일수
         */
        if (show) {
            const date = new Date();
            const startServiceDay = search.startServiceDay || moment(date).subtract(period[0], period[1]).startOf('day');
            const endServiceDay = search.endServiceDay || moment(date).endOf('day');
            let ns = {
                ...search,
                masterCode: selectedComponent.schCodeId || null,
                sourceList,
                startServiceDay: moment(startServiceDay).format(DB_DATEFORMAT),
                endServiceDay: moment(endServiceDay).format(DB_DATEFORMAT),
                contentType: media ? 'M' : null,
                page: 0,
            };

            dispatch(changeSearchOption(ns));
            if (sourceOn) {
                dispatch(getArticleList({ search: ns }));
            }
        } else {
            dispatch(clearList());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent.schCodeId, sourceOn, show]);

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div style={{ width: 78 }} className="mr-2">
                    <MokaInput as="select" name="period" onChange={handleChangeValue} value={period.join('')}>
                        <option value="2days" data-number="2" data-date="days">
                            2일
                        </option>
                        <option value="3days" data-number="3" data-date="days">
                            3일
                        </option>
                        <option value="7days" data-number="7" data-date="days">
                            7일
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
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'start' }} onChange={handleChangeSDate} value={search.startServiceDay} />
                </div>

                {/* 종료일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputProps={{ timeFormat: null, timeDefault: 'end' }} onChange={handleChangeEDate} value={search.endServiceDay} />
                </div>

                {/* 검색 조건 */}
                <div style={{ width: 110 }} className="mr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 키워드 */}
                <MokaSearchInput className="flex-fill mr-2" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />

                {/* 초기화 */}
                <Button variant="negative" className="flex-shrink-0" onClick={handleClickReset}>
                    초기화
                </Button>
            </Form.Row>
            <Form.Row className="d-flex mb-2 justify-content-between">
                <div className="d-flex">
                    {/* 분류 */}
                    <div style={{ width: 340 }} className="mr-2">
                        <CodeAutocomplete name="masterCode" className="mb-0" placeholder="분류 선택" value={search.masterCode} onChange={handleChangeMasterCode} />
                    </div>

                    {/* 매체 */}
                    <SourceSelector
                        className="mr-2"
                        value={sourceList}
                        onChange={(value) => {
                            setSourceList(value);
                            setError({ ...error, sourceList: false });
                            if (value !== '') {
                                setSourceOn(true);
                            }
                        }}
                        sourceType={isNaverChannel ? 'BULK' : 'DESKING'}
                        isInvalid={error.sourceList}
                    />

                    {/* 면 */}
                    <div style={{ width: 60 }} className="mr-2">
                        <MokaInput placeholder="면" name="pressMyun" onChange={handleChangeValue} value={search.pressMyun} disabled={searchDisabled} />
                    </div>

                    {/* 판 */}
                    <div style={{ width: 60 }} className="mr-2">
                        <MokaInput placeholder="판" name="pressPan" onChange={handleChangeValue} value={search.pressPan} disabled={searchDisabled} />
                    </div>
                </div>
                {!isNaverChannel && (
                    <React.Fragment>
                        <Button variant="outline-neutral" className="flex-shrink-0" onClick={() => setModalShow(true)}>
                            그룹지정
                        </Button>
                        {/* 그룹지정 변경 모달 */}
                        <ChangeArtGroupModal show={modalShow} onHide={() => setModalShow(false)} onSave={onChangeGroupNumber} />
                    </React.Fragment>
                )}
            </Form.Row>
        </Form>
    );
};

ArticleDeskSearch.defaultProps = defaultProps;

export default ArticleDeskSearch;
