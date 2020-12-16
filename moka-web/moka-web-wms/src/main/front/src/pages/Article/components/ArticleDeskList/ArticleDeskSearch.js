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
import { initialState, getArticleList, changeSearchOption, clearList } from '@store/article';

/**
 * 기사 검색
 */
const ArticleDeskSearch = (props) => {
    const { media, selectedComponent, show } = props;
    const dispatch = useDispatch();
    const storeSearch = useSelector((store) => store.article.search);

    // state
    const [search, setSearch] = useState(initialState.search);
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [error, setError] = useState({});
    const [sourceOn, setSourceOn] = useState(false);
    const [deskingSourceList, setDeskingSourceList] = useState(null);

    /**
     * 입력값 변경
     * @param {object} e Event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * validate
     */
    const validate = (ns) => {
        let isInvalid = false;

        if (!REQUIRED_REGEX.test(ns.deskingSourceList)) {
            isInvalid = isInvalid || true;
            setError({ ...error, deskingSourceList: true });
        }

        return !isInvalid;
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let ns = {
            ...search,
            deskingSourceList,
            startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
            endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
            page: 0,
        };

        if (validate(ns)) {
            dispatch(getArticleList({ search: ns }));
            dispatch(changeSearchOption(ns));
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
                deskingSourceList,
                startServiceDay,
                endServiceDay,
                contentType: media ? 'M' : null,
                page: 0,
            };

            if (sourceOn) {
                dispatch(getArticleList({ search: ns }));
                dispatch(changeSearchOption(ns));
            }
        } else {
            dispatch(clearList());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent.masterCode, sourceOn, show]);

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
                        value={deskingSourceList}
                        onChange={(value) => {
                            setDeskingSourceList(value);
                            setError({ ...error, deskingSourceList: false });
                            if (value !== '') {
                                setSourceOn(true);
                            }
                        }}
                        isInvalid={error.deskingSourceList}
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
