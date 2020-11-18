import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaSearchInput } from '@components';
import { initialState, getArticleList, changeSearchOption } from '@store/article';

/**
 * 페이지편집 > 기자 리스트 > 기자 검색
 */
const ReporterDeskSearch = () => {
    const dispatch = useDispatch();
    const { storeSearch } = useSelector((store) => ({
        storeSearch: store.article.search,
    }));

    // state
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'keyword') {
            setSearch({ ...search, keyword: value });
        }
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getArticleList(
                changeSearchOption({
                    ...search,
                    startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
                    endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
                    page: 0,
                }),
            ),
        );
    };

    useEffect(() => {
        setSearch({
            ...storeSearch,
            startServiceDay: moment(storeSearch.startServiceDay, DB_DATEFORMAT),
            endServiceDay: moment(storeSearch.endServiceDay, DB_DATEFORMAT),
        });
    }, [storeSearch]);

    useEffect(() => {
        /**
         * 마운트 시 기사목록 최초 로딩
         *
         * 시작일 : 현재 시간(시분초o)
         * 종료일 : 현재 시간(시분초o) - 24시간
         */
        const date = new Date();
        dispatch(
            getArticleList(
                changeSearchOption({
                    ...storeSearch,
                    startServiceDay: moment('2020-08-21 00:00').format(DB_DATEFORMAT),
                    endServiceDay: moment('2020-08-22 00:00').format(DB_DATEFORMAT),
                    // startServiceDay: moment(date).add(-24, 'hours').format(DB_DATEFORMAT),
                    // endServiceDay: moment(date).add(-2, 'month').format(DB_DATEFORMAT),
                    page: 0,
                }),
            ),
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Form>
            <Form.Row className="d-flex mb-2">
                {/* 기자 검색 */}
                <MokaSearchInput className="flex-fill mr-2" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />

                {/* 초기화 */}
                <Button variant="outline-neutral" className="ft-12">
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default ReporterDeskSearch;
