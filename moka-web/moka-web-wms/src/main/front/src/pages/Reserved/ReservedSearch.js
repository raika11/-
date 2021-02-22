import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaSearchInput, MokaInput } from '@components';
import { getReservedList, changeSearchOption, initialState } from '@store/reserved';
import { changeLatestDomainId } from '@store/auth';

/**
 * 예약어 검색
 */
const ReservedSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList } = useSelector(({ auth }) => ({
        latestDomainId: auth.latestDomainId,
        domainList: auth.domainList,
    }));
    const { search: storeSearch } = useSelector(({ reserved }) => reserved);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getReservedList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 검색옵션 변경
     * @param {object} e 이벤트
     */
    const handleChangeSearchOption = (e) => {
        if (e.target.name === 'domainId') {
            dispatch(changeLatestDomainId(e.target.value));
            history.push(match.path);
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

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // latestDomainId를 예약어의 search.domainId로 변경
        if (latestDomainId && latestDomainId !== search.domainId) {
            dispatch(
                getReservedList(
                    changeSearchOption({
                        ...search,
                        domainId: latestDomainId,
                        page: 0,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    return (
        <Form className="mb-14">
            <MokaInput as="select" className="mb-2" value={search.domainId} onChange={handleChangeSearchOption} name="domainId">
                {domainList.map((domain) => (
                    <option key={domain.domainId} value={domain.domainId}>
                        {domain.domainName}
                    </option>
                ))}
            </MokaInput>
            <Form.Row>
                <div className="mr-2 flex-shrink-0">
                    <MokaInput as="select" value={search.searchType || 'all'} onChange={handleChangeSearchOption} name="searchType">
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <MokaSearchInput className="flex-fill" value={search.keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
            </Form.Row>
        </Form>
    );
};

export default ReservedSearch;
