import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaSearchInput } from '@components';
import { initialState, changeSearchOption, getReporterList } from '@store/reporter';
import ReporterSearchListModal from './modals/ReporterSearchListModal';
import { Button, Col, Form } from 'react-bootstrap';

/**
 * 기자 관리 > 기자 목록 검색
 */
const ReporterMgrSearch = () => {
    const dispatch = useDispatch();
    const [datasetApiListModalShow, setDatasetApiListModalShow] = useState(false);
    const { search: storeSearch } = useSelector((store) => ({
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

    const handleClickReset = () => {
        setSearch({
            ...search,
            keyword: '',
        });
    };

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

    /**
     * dataApiListPopup 저장 이벤트 핸들러
     * @param {Object} selectApi 선택한 API
     * @param {function} hideCallback 숨김 함수
     */
    const handleClicktListModalSave = (data, hideCallback) => {
        if (data) {
            setSearch({
                ...search,
                keyword: data.repName,
            });
            hideCallback();
        }
    };

    return (
        <>
            <Form>
                <Form.Row className="mb-14">
                    <Col xs={5} className="d-flex p-0 mr-1">
                        <MokaSearchInput
                            value={search.keyword}
                            onChange={handleChangeSearchOption}
                            onSearch={handleSearch}
                            placeholder="기자 이름을 검색하세요"
                            name="keyword"
                            className="flex-fill"
                        />
                    </Col>
                    <Button variant="negative" className="flex-shrink-0" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Form.Row>
            </Form>
            <ReporterSearchListModal show={datasetApiListModalShow} onHide={() => setDatasetApiListModalShow(false)} onClickSave={handleClicktListModalSave} />
        </>
    );
};

export default ReporterMgrSearch;
