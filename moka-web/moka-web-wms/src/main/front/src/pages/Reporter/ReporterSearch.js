import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput } from '@components';
import { useHistory } from 'react-router-dom';
import { initialState, changeSearchOption, GET_REPORTER_LIST, getReporterList, getReporter } from '@store/reporter';
import { Button } from 'react-bootstrap';
import ReporterSearchModal from '@pages/Reporter/modals/ReporterSearchModal';
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
                    <Button variant="primary" className="mr-05" onClick={() => setDatasetApiListModalShow(true)}>
                        기자모달팝업
                    </Button>
                    {/*
                    <MokaSearchInput
                        className="w-100"
                        placeholder="데이터를 선택해주세요"
                        //value={decodeURIComponent(dataApiUrl)}
                        onSearch={() => setDatasetApiListModalShow(true)}
                        inputProps={{ readOnly: true }}
                    />
                    */}
                </Col>
            </Form.Row>
            <ReporterSearchModal show={datasetApiListModalShow} onHide={() => setDatasetApiListModalShow(false)} />
        </Form>
    );
};

export default ReporterMgrSearch;
