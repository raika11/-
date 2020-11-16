import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { defaultArticleSearchType, CodeAutocomplete } from '@pages/commons';
import { initialState, getArticleList, changeSearchOption } from '@store/article';

/**
 * 기사 검색
 */
const ArticleSearch = (props) => {
    const { video } = props;
    const dispatch = useDispatch();
    const { storeSearch } = useSelector((store) => ({
        storeSearch: store.article.search,
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [searchDisabled, setSearchDisabled] = useState(false);

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'searchType') {
            setSearch({ ...search, searchType: value });
        } else if (name === 'keyword') {
            setSearch({ ...search, keyword: value });
        } else if (name === 'pressMyun') {
            setSearch({ ...search, pressMyun: value });
        } else if (name === 'pressPan') {
            setSearch({ ...search, pressPan: value });
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

    /**
     * 시작일 변경
     * @param {object} date moment object
     */
    const handleChangeSDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, startServiceDay: date });
        }
    };

    /**
     * 종료일 변경
     * @param {object} date moment object
     */
    const handleChangeEDate = (date) => {
        if (typeof date === 'object') {
            setSearch({ ...search, endServiceDay: date });
        }
    };

    /**
     * 분류 변경
     * @param {string} value value
     */
    const handleChangeMasterCode = (value) => {
        setSearch({ ...search, masterCode: value });
    };

    useEffect(() => {
        setSearch({
            ...storeSearch,
            startServiceDay: moment(storeSearch.startServiceDay, DB_DATEFORMAT),
            endServiceDay: moment(storeSearch.endServiceDay, DB_DATEFORMAT),
        });
    }, [storeSearch]);

    useEffect(() => {
        if (video) setSearchDisabled(true);
    }, [video]);

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
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {defaultArticleSearchType.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                {/* 키워드 */}
                <MokaSearchInput variant="dark" className="flex-fill mr-2" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />

                {/* 초기화 */}
                <Button variant="dark" className="ft-12">
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
                    <div style={{ width: 130 }} className="mr-2">
                        <MokaInput as="select" name="sourceCode" value={search.sourceCode} onChange={handleChangeValue}>
                            <option hidden>매체 전체</option>
                        </MokaInput>
                    </div>

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
                <Button variant="dark" className="ft-12">
                    그룹지정
                </Button>
            </Form.Row>
        </Form>
    );
};

export default ArticleSearch;
