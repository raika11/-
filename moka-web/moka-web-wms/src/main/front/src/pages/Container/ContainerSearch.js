import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getContainerList, changeSearchOption } from '@store/container';
import { changeLatestDomainId } from '@store/auth';

/**
 * 컨테이너 검색 컴포넌트
 */
const ContainerSearch = () => {
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
        <Form className="mb-14">
            <MokaInput as="select" className="mb-2" value={search.domainId || undefined} onChange={handleChangeSearchOption} name="domainId">
                {domainList.map((domain) => (
                    <option key={domain.domainId} value={domain.domainId}>
                        {domain.domainName}
                    </option>
                ))}
            </MokaInput>
            <Form.Group as={Row}>
                <div className="mr-2 flex-shrink-0">
                    <MokaInput as="select" value={search.searchType} onChange={handleChangeSearchOption} name="searchType">
                        {searchTypeList.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <MokaSearchInput className="flex-fill" value={search.keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
            </Form.Group>
        </Form>
    );
};

export default ContainerSearch;
