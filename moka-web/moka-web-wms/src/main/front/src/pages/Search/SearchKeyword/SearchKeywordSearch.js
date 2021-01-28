import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { messageBox } from '@utils/toastUtil';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, changeStatSearchOption, getSearchKeywordStat, getSearchKeywordStatTotal } from '@store/searchKeyword';

moment.locale('ko');

/**
 * 검색 로그 검색
 */
const SearchKeywordSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ searchKeyword }) => searchKeyword.stat.search);
    const [search, setSearch] = useState(initialState.stat.search);
    const [period, setPeriod] = useState('day');
    const [error, setError] = useState({});

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'period') {
            // 기간 설정
            const nt = new Date();
            const endDt = moment(nt);
            const startDt = moment(nt).startOf(value).startOf('day');
            setPeriod(value);
            setSearch({ ...search, startDt, endDt });
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSD = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, startDt: date });
            setError({ ...error, startDt: false });
        } else if (date === '') {
            setSearch({ ...search, startDt: null });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeED = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, endDt: date });
            setError({ ...error, endDt: false });
        } else if (date === '') {
            setSearch({ ...search, endDt: null });
        }
    };

    /**
     * 검색조건 초기화
     */
    const handleReset = () => {
        const nt = new Date();
        const dt = moment(nt);
        const st = moment(nt).startOf('day');
        const ns = { ...initialState.stat.search, startDt: st, endDt: dt };
        setSearch(ns);
        setPeriod('day');
    };

    /**
     * 검색조건 validate
     */
    const validate = () => {
        let isInvalid = false;

        if (!search.startDt) {
            setError({ ...error, startDt: true });
            isInvalid = isInvalid || true;
        }
        if (!search.endDt) {
            setError({ ...error, endDt: true });
            isInvalid = isInvalid || true;
        }

        return !isInvalid;
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        if (validate()) {
            const ns = {
                ...search,
                startDt: moment(search.startDt).format(DB_DATEFORMAT),
                endDt: moment(search.endDt).format(DB_DATEFORMAT),
                page: 0,
            };

            dispatch(changeStatSearchOption(ns));
            // 통계 조회
            dispatch(
                getSearchKeywordStat({
                    search: ns,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.mesage);
                        }
                    },
                }),
            );
            // 전체 건수 조회
            dispatch(
                getSearchKeywordStatTotal({
                    search: {
                        startDt: ns.startDt,
                        endDt: ns.endDt,
                    },
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.mesage);
                        }
                    },
                }),
            );
        }
    };

    useEffect(() => {
        const startDt = moment(storeSearch.startDt, DB_DATEFORMAT);
        const endDt = moment(storeSearch.endDt, DB_DATEFORMAT);
        setSearch({
            ...storeSearch,
            startDt: startDt.isValid() ? startDt : null,
            endDt: endDt.isValid() ? endDt : null,
        });
    }, [storeSearch]);

    useEffect(() => {
        const nt = new Date();
        const dt = moment(nt).format(DB_DATEFORMAT);
        const st = moment(nt).startOf(period).format(DB_DATEFORMAT);
        const ns = { ...initialState.stat.search, startDt: st, endDt: dt };
        dispatch(changeStatSearchOption(ns));
        // 통계 조회
        dispatch(
            getSearchKeywordStat({
                search: ns,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.mesage);
                    }
                },
            }),
        );
        // 전체 건수 조회
        dispatch(
            getSearchKeywordStatTotal({
                search: {
                    startDt: ns.startDt,
                    endDt: ns.endDt,
                },
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.mesage);
                    }
                },
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <div className="mb-2">
            <Form.Row>
                <Col xs={6} className="p-0 pr-2 d-flex">
                    <div className="flex-shrink-0 mr-2">
                        <MokaInput as="select" name="period" onChange={handleChangeValue} value={period}>
                            <option value="day">오늘</option>
                            <option value="isoWeek">이번주</option>
                            <option value="month">이번달</option>
                            <option value="year">올해</option>
                        </MokaInput>
                    </div>
                    <MokaInput
                        as="dateTimePicker"
                        className="mr-1"
                        name="startDt"
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        value={search.startDt}
                        onChange={handleChangeSD}
                        isInvalid={error.startDt}
                    />
                    <MokaInput
                        as="dateTimePicker"
                        className="ml-1"
                        name="endDt"
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                        value={search.endDt}
                        onChange={handleChangeED}
                        isInvalid={error.endDt}
                    />
                </Col>
                <Col xs={6} className="p-0 d-flex">
                    <MokaSearchInput
                        name="keyword"
                        className="mr-2 flex-fill"
                        onChange={handleChangeValue}
                        value={search.keyword}
                        onSearch={handleSearch}
                        placeholder="검색어를 입력하세요"
                    />
                    <Button variant="negative" onClick={handleReset} className="flex-shrink-0">
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </div>
    );
};

export default SearchKeywordSearch;
