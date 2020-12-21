import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { CodeAutocomplete } from '@pages/commons';
import { ChangeArtGroupModal } from '@pages/Article/modals';
import { SourceSelector } from '@pages/commons';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { initialState, getArticleList, getBulkArticleList, changeSearchOption, clearList } from '@store/article';

/**
 * 기사 검색
 */
const ArticleDeskSearch = (props) => {
    const { media, selectedComponent, show, isNaverChannel } = props;
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.article.search);

    // state
    const [search, setSearch] = useState(initialState.search);
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState({});
    const [sourceOn, setSourceOn] = useState(false);
    const [sourceList, setSourceList] = useState(null);
    const [period, setPeriod] = useState([2, 'days']);

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
            const startServiceDay = moment(nd).subtract(Number(number), date);
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
            !isNaverChannel ? dispatch(getArticleList({ search: ns })) : dispatch(getBulkArticleList({ search: ns }));
        }
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

        dispatch(
            changeSearchOption({
                ...initialState.search,
                masterCode: selectedComponent.masterCode || null,
                startServiceDay: moment(date).add(-24, 'hours').format(DB_DATEFORMAT),
                endServiceDay: moment(date).format(DB_DATEFORMAT),
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
         * 종료일 : 현재 시간(시분초o) - 24시간
         */
        if (show) {
            // const date = new Date();
            // const startServiceDay = search.startServiceDay || moment(date).add(-24, 'hours');
            // const endServiceDay = search.endServiceDay || moment(date);
            const startServiceDay = search.startServiceDay ? moment(search.startServiceDay).format(DB_DATEFORMAT) : '2020-08-21 00:00:00';
            const endServiceDay = search.endServiceDay ? moment(search.endServiceDay).format(DB_DATEFORMAT) : '2020-08-22 00:00:00';
            let ns = {
                ...search,
                masterCode: selectedComponent.masterCode || null,
                sourceList,
                startServiceDay,
                endServiceDay,
                contentType: media ? 'M' : null,
                page: 0,
            };

            dispatch(changeSearchOption(ns));
            if (sourceOn) {
                !isNaverChannel ? dispatch(getArticleList({ search: ns })) : dispatch(getBulkArticleList({ search: ns }));
            }
        } else {
            dispatch(clearList());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent.masterCode, sourceOn, show]);

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 검색기간 */}
                <div style={{ width: 78 }} className="mr-2">
                    <MokaInput as="select" name="period" className="ft-12" onChange={handleChangeValue} value={period.join('')}>
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
                    <MokaInput as="dateTimePicker" inputClassName="ft-12" inputProps={{ timeFormat: null }} onChange={handleChangeSDate} value={search.startServiceDay} />
                </div>

                {/* 종료일 */}
                <div style={{ width: 138 }} className="mr-2">
                    <MokaInput as="dateTimePicker" inputClassName="ft-12" inputProps={{ timeFormat: null }} onChange={handleChangeEDate} value={search.endServiceDay} />
                </div>

                {/* 검색 조건 */}
                <div style={{ width: 110 }} className="mr-2">
                    <MokaInput as="select" name="searchType" className="ft-12" value={search.searchType} onChange={handleChangeValue}>
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
                <Button variant="negative" className="ft-12" onClick={handleClickReset}>
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
                        bulk={isNaverChannel}
                        onChange={(value) => {
                            setSourceList(value);
                            setError({ ...error, sourceList: false });
                            if (value !== '') {
                                setSourceOn(true);
                            }
                        }}
                        isInvalid={error.sourceList}
                    />

                    {/* 면 */}
                    <div style={{ width: 85 }} className="mr-2">
                        <MokaInputLabel
                            label="면"
                            labelWidth={25}
                            className="mb-0"
                            inputClassName="ft-12"
                            name="pressMyun"
                            value={search.pressMyun}
                            onChange={handleChangeValue}
                            disabled={searchDisabled}
                        />
                    </div>

                    {/* 판 */}
                    <div style={{ width: 85 }} className="mr-2">
                        <MokaInputLabel
                            label="판"
                            labelWidth={25}
                            className="mb-0"
                            inputClassName="ft-12"
                            name="pressPan"
                            value={search.pressPan}
                            onChange={handleChangeValue}
                            disabled={searchDisabled}
                        />
                    </div>
                </div>
                <Button variant="outline-neutral" className="ft-12" onClick={() => setModalShow(true)}>
                    그룹지정
                </Button>
            </Form.Row>

            <ChangeArtGroupModal show={modalShow} onHide={() => setModalShow(false)} />
        </Form>
    );
};

export default ArticleDeskSearch;
