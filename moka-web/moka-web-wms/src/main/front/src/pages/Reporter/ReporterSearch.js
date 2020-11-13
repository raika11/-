import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { initialState, changeSearchOption, GET_REPORTER_LIST, getReporterList, getReporter } from '@store/reporter';
import { Button } from 'react-bootstrap';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal'; // 내가 참조해서 만든거

/**
 * 기자 목록 검색 컴포넌트
 */
const ReporterMgrSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [datasetApiListModalShow, setDatasetApiListModalShow] = useState(false);
    const { reporter, search: storeSearch } = useSelector((store) => ({
        search: store.reporter.search,
    }));

    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getReporterList());
    }, [dispatch]);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getReporterList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    const handleChangeSearchOption = (e) => {
        setSearch({
            ...search,
            keyword: e.target.value,
        });
    };

    return (
        <Form>
            <Form.Row>
                <Col xs={7} className="p-0 mb-2">
                    <MokaSearchInput value={search.keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} placeholder="기자 이름을 검색하세요" name="keyword" />
                    <MokaSearchInput
                        className="w-100"
                        placeholder="(모달팝업)기자 이름을 검색해주세요."
                        onChange={handleChangeSearchOption}
                        value={decodeURIComponent(search.keyword)}
                        onSearch={() => setDatasetApiListModalShow(true)}
                        //inputProps={{ readOnly: true }}
                        name="keyword"
                    />
                </Col>
            </Form.Row>
            <ReporterListModal show={datasetApiListModalShow} onHide={() => setDatasetApiListModalShow(false)} />
        </Form>
    );
};

export default ReporterMgrSearch;
