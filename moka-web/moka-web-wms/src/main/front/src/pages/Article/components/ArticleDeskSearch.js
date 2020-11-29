import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { defaultArticleSearchType, CodeAutocomplete } from '@pages/commons';
import { ChangeArtGroupModal } from '@pages/Article/modals';
import { initialState, getArticleList, getSourceList, changeSearchOption, clearList } from '@store/article';

/**
 * 기사 검색
 */
const ArticleDeskSearch = (props) => {
    const { media, selectedComponent, show } = props;
    const dispatch = useDispatch();
    const { storeSearch, sourceList } = useSelector((store) => ({
        storeSearch: store.article.search,
        sourceList: store.article.sourceList,
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [modalShow, setModalShow] = useState(false);

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
        } else if (name === 'sourceCode') {
            setSearch({ ...search, sourceCode: value });
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

    /**
     * 초기화 버튼
     * @param {object} e event
     */
    const handleClickReset = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const date = new Date();

        setSearch({
            ...initialState.search,
            masterCode: selectedComponent.masterCode || null,
            startServiceDay: moment(date).add(-24, 'hours').format(DB_DATEFORMAT),
            endServiceDay: moment(date).format(DB_DATEFORMAT),
            page: 0,
        });
    };

    useEffect(() => {
        // 매체 조회
        if (sourceList.length < 1) {
            dispatch(getSourceList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setSearch({
            ...storeSearch,
            masterCode: selectedComponent.masterCode || null,
            startServiceDay: moment(storeSearch.startServiceDay, DB_DATEFORMAT),
            endServiceDay: moment(storeSearch.endServiceDay, DB_DATEFORMAT),
        });
    }, [selectedComponent.masterCode, storeSearch]);

    useEffect(() => {
        if (media) setSearchDisabled(true);
    }, [media]);

    useEffect(() => {
        /**
         * 마운트 시 기사목록 최초 로딩
         *
         * 시작일 : 현재 시간(시분초o)
         * 종료일 : 현재 시간(시분초o) - 24시간
         */

        if (show) {
            // const date = new Date();
            // const startServiceDay = storeSearch.startServiceDay || moment(date).add(-24, 'hours');
            // const endServiceDay = storeSearch.endServiceDay || moment(date);
            const startServiceDay = storeSearch.startServiceDay || '2020-08-21 00:00:00';
            const endServiceDay = storeSearch.endServiceDay || '2020-08-22 00:00:00';

            dispatch(
                getArticleList(
                    changeSearchOption({
                        ...storeSearch,
                        masterCode: selectedComponent.masterCode || null,
                        startServiceDay,
                        endServiceDay,
                        contentType: media ? 'M' : null,
                        page: 0,
                    }),
                ),
            );
        } else {
            dispatch(clearList());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent.masterCode, show]);

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
                <MokaSearchInput className="flex-fill mr-2" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />

                {/* 초기화 */}
                <Button variant="outline-neutral" className="ft-12" onClick={handleClickReset}>
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
                        <MokaInput as="select" name="sourceCode" value={search.sourceCode} onChange={handleChangeValue} className="ft-12">
                            {sourceList.map(
                                (cd) =>
                                    cd.usedYn === 'Y' && (
                                        <option key={cd.sourceCode} value={cd.sourceCode}>
                                            {cd.sourceName}
                                        </option>
                                    ),
                            )}
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
                <Button variant="outline-neutral" className="ft-12" onClick={() => setModalShow(true)}>
                    그룹지정
                </Button>
            </Form.Row>

            <ChangeArtGroupModal show={modalShow} onHide={() => setModalShow(false)} />
        </Form>
    );
};

export default ArticleDeskSearch;
