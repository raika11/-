import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';
import { getReservedList, changeSearchOption, initialState } from '@store/reserved';
import { changeLatestDomainId } from '@store/auth';

/**
 * 예약어 검색
 */
const ReservedSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList, search: storeSearch } = useSelector((store) => ({
        latestDomainId: store.auth.latestDomainId,
        domainList: store.auth.domainList,
        search: store.reserved.search,
    }));

    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * latestDomainId를 예약어의 search.domainId로 변경
     */
    useEffect(() => {
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

    return (
        <Form className="mb-2">
            <MokaInput as="select" className="mb-2 ft-12" value={search.domainId || undefined} onChange={handleChangeSearchOption} name="domainId">
                {domainList.map((domain) => (
                    <option key={domain.domainId} value={domain.domainId}>
                        {domain.domainName}
                    </option>
                ))}
            </MokaInput>
            <Form.Row>
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput as="select" value={search.searchType || 'all'} onChange={handleChangeSearchOption} name="searchType" className="ft-12">
                        <option value="all">전체</option>
                        <option value="reservedId">코드</option>
                        <option value="reservedValue">값</option>
                    </MokaInput>
                </Col>
                <Col xs={8} className="p-0">
                    <MokaSearchInput
                        value={search.keyword}
                        onChange={handleChangeSearchOption}
                        onSearch={handleSearch}
                        name="keyword"
                        inputClassName="ft-12"
                        buttonClassName="ft-12"
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ReservedSearch;
