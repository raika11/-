import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getContainerList, changeSearchOption } from '@store/container';
import { changeLatestDomainId } from '@store/auth';

/**
 * 컨테이너 검색 컴포넌트
 */
const ReporterMgrSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList, search: storeSearch, searchTypeList } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
        search: store.container.search,
        searchTypeList: store.container.searchTypeList,
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
        if (latestDomainId && latestDomainId !== search.domainId) {
            dispatch(
                getContainerList(
                    changeSearchOption({
                        ...search,
                        domainId: latestDomainId,
                        page: 0,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getContainerList(
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
        if (e.target.name === 'domainId') {
            dispatch(changeLatestDomainId(e.target.value));
            history.push('/container');
        } else if (e.target.name === 'searchType') {
            setSearch({
                ...search,
                searchType: e.target.value,
            });
        } else if (e.target.name === 'keyword') {
            setSearch({
                ...search,
                keyword: e.target.value,
            });
        }
    };

    return (
        <Form className="mb-10">
            <Form.Group as={Row} className="mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInput as="select" className="m-0 mb-2" value={search.searchType} onChange={handleChangeSearchOption} name="searchType">
                        {searchTypeList.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput value={search.keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default ReporterMgrSearch;
