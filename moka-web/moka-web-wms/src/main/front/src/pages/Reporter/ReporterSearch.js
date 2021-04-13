import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { getJplusRep } from '@/store/codeMgt';
import { initialState, changeSearchOption, getReporterList } from '@store/reporter';
import ReporterSearchListModal from './modals/ReporterSearchListModal';

/**
 * 기자 관리 > 기자 목록 검색
 */
const ReporterMgrSearch = () => {
    const dispatch = useDispatch();
    const [datasetApiListModalShow, setDatasetApiListModalShow] = useState(false);
    const jplusRepRows = useSelector(({ codeMgt }) => codeMgt.jplusRepRows);
    const { search: storeSearch } = useSelector((store) => ({
        search: store.reporter.search,
    }));

    const [search, setSearch] = useState(initialState.search);

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
        setSearch(initialState.search);
    };

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    const handleChangeSearchOption = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
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

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getReporterList(getJplusRep()));
    }, [dispatch]);

    return (
        <>
            <Form>
                <Form.Row className="mb-14">
                    {/* 검색 타입 */}
                    <Col xs={2} className="p-0 pr-2">
                        <MokaInput as="select" name="jplusRepDiv" value={search.jplusRepDiv} onChange={handleChangeSearchOption}>
                            <option value="">전체</option>
                            {jplusRepRows &&
                                jplusRepRows.map((rep) => (
                                    <option key={rep.cdOrd} value={rep.dtlCd}>
                                        {rep.cdNm}
                                    </option>
                                ))}
                            <option value="NL">일보기자</option>
                        </MokaInput>
                    </Col>

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
