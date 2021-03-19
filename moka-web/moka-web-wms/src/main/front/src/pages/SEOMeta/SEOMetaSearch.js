import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@utils/toastUtil';
import { initialState, changeSeoMetaSearchOptions, getSeoMetaList } from '@store/seoMeta';

/**
 * SEO 메타 검색
 */
const SEOMetaSearch = () => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ seoMeta }) => seoMeta.search);
    const [dateType, setDateType] = useState('today');
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @params {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'dateType') {
            setDateType(value);
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 검색
     * @params {object} search 검색조건
     */
    const handleSearch = (search) => {
        const startDt = search.startDt && search.startDt.isValid() ? moment(search.startDt).format(DB_DATEFORMAT) : null;
        const endDt = search.endDt && search.endDt.isValid() ? moment(search.endDt).format(DB_DATEFORMAT) : null;
        const ns = { ...search, startDt, endDt, page: 0 };
        dispatch(changeSeoMetaSearchOptions(ns));
        dispatch(getSeoMetaList(ns));
    };

    /**
     * 초기화 버튼
     */
    const handleClickReset = () => {
        setDateType('today');
        setSearch(initialState.search);
    };

    useEffect(() => {
        let st = moment(storeSearch.startDt, DB_DATEFORMAT);
        if (!st.isValid()) {
            st = null;
        }
        let nt = moment(storeSearch.endDt, DB_DATEFORMAT);
        if (!nt.isValid()) {
            nt = null;
        }
        setSearch({ ...storeSearch, startDt: st, endDt: nt });
    }, [storeSearch]);

    useEffect(() => {
        const diff = moment(search.endDt).diff(moment(search.startDt));
        if (diff < 0) {
            toast.warning('시작일은 종료일 보다 클 수 없습니다.');
            setSearch({ ...search, startDt: moment().format(DB_DATEFORMAT) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.startDt, search.endDt]);

    useEffect(() => {
        // 날짜 타입에 따른 셋팅 && SEO 메타 목록 조회
        const nt = new Date();
        const ns = { ...search, startDt: moment(nt).startOf('day'), endDt: moment(nt).endOf('day') };
        setSearch(ns);
        handleSearch(ns);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateType]);

    return (
        <Form className="mb-14">
            <Form.Row className="justify-content-between align-items-center">
                {/* 날짜 선택 */}
                <div className="mr-2 flex-shrink-0">
                    <MokaInput as="select" name="dateType" onChange={handleChangeValue} value={dateType}>
                        <option value="today">오늘</option>
                        <option value="thisWeek">이번주</option>
                        <option value="thisMonth">이번달</option>
                    </MokaInput>
                </div>

                {/* 시작일 */}
                <div className="mr-2">
                    <MokaInput
                        as="dateTimePicker"
                        name="startDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, width: 140, timeDefault: 'start' }}
                        value={search.startDt}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, startDt: date });
                            } else if (date === '') {
                                setSearch({ ...search, startDt: null });
                            }
                        }}
                    />
                </div>

                {/* 종료일 */}
                <div className="mr-2">
                    <MokaInput
                        as="dateTimePicker"
                        name="endDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, width: 140, timeDefault: 'end' }}
                        value={search.endDt}
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setSearch({ ...search, endDt: date });
                            } else if (date === '') {
                                setSearch({ ...search, endDt: null });
                            }
                        }}
                    />
                </div>

                {/* 검색조건 */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        <option value="artTitle">제목</option>
                        <option value="totalId">기사ID</option>
                    </MokaInput>
                </div>

                {/* 검색어 */}
                <MokaSearchInput className="mr-1 flex-fill" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={() => handleSearch(search)} />

                {/* 초기화 */}
                <Button variant="negative" onClick={handleClickReset} className="flex-shrink-0">
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default SEOMetaSearch;
