import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';

import { changeLatestDomainId } from '@store/auth';
import { getPageTree, changeSearchOption, initialState } from '@store/page';

const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'pageSeq', name: '페이지ID' },
    { id: 'pageName', name: '페이지명' },
    { id: 'pageServiceName', name: '서비스명' },
    { id: 'pageBody', name: '페이지본문' },
];

/**
 * 페이지 검색 컴포넌트
 */
const PageSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList, search: storeSearch } = useSelector(
        (store) => ({
            latestDomainId: store.auth.latestDomainId,
            domainList: store.auth.domainList,
            search: store.page.search,
        }),
        shallowEqual,
    );
    const [search, setSearch] = React.useState(initialState.search);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getPageTree(
                changeSearchOption({
                    ...search,
                }),
            ),
        );
    }, [dispatch, search]);

    useEffect(() => {
        // latestDomainId 변경 => 템플릿의 search.domainId 변경
        if (latestDomainId && latestDomainId !== search.domainId) {
            dispatch(
                getPageTree(
                    changeSearchOption({
                        ...search,
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    return (
        <Form className="mb-10">
            {/* 도메인 선택 */}
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
                    className="w-100"
                    value={search.domainId || undefined}
                    onChange={(e) => {
                        dispatch(changeLatestDomainId(e.target.value));
                        history.push('/page');
                    }}
                >
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form.Row>
            <Form.Group as={Row} className="mb-2">
                {/* 검색조건 */}
                <Col xs={4} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        value={search.searchType || undefined}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                searchType: e.target.value,
                            });
                        }}
                    >
                        {defaultSearchType.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                {/* 키워드 */}
                <Col xs={8} className="p-0">
                    <MokaSearchInput
                        value={search.keyword}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                keyword: e.target.value,
                            });
                        }}
                        onSearch={handleSearch}
                    />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default PageSearch;
