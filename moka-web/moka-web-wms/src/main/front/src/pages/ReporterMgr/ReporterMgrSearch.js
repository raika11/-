import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getReporterList, changeSearchOption } from '@store/reporter';

//import { changeLatestDomainId } from '@store/auth';

/**
 * 컨테이너 검색 컴포넌트
 */
const ReporterMgrSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestRepSeq, reporterList, search: storeSearch, searchTypeList } = useSelector((store) => ({
        latestRepSeq: store.auth.latestRepSeq,
        reporterList: store.auth.reporterList,
        search: store.reporter.search,
        searchTypeList: store.reporter.searchTypeList,
    }));

    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * latestDomainId를 컨테이너의 search.domainId로 변경
     */
    useEffect(() => {
        if (latestRepSeq && latestRepSeq !== search.repSeq) {
            dispatch(
                getReporterList(
                    changeSearchOption({
                        ...search,
                        repSeq: latestRepSeq,
                        page: 0,
                    }),
                ),
            );
        }
    }, [dispatch, latestRepSeq, search]);

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
        <Form className="mb-10">
            <Form.Group as={Row} className="mb-2">
                <Col xs={7} className="p-0">
                    <MokaSearchInput value={search.keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default ReporterMgrSearch;
