import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { MokaSearchInput, MokaInput } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { getArticlePageList, changeSearchOption, initialState } from '@store/articlePage';

/**
 * 관련 기사페이지 검색 컴포넌트
 */
const ArticlePageSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList } = useSelector(({ auth }) => ({
        latestDomainId: auth.latestDomainId,
        domainList: auth.domainList,
    }));
    const storeSearch = useSelector(({ articlePage }) => articlePage.search);
    const [search, setSearch] = React.useState(initialState.search);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getArticlePageList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    useEffect(() => {
        // latestDomainId 변경 => search.domainId 변경
        if (latestDomainId !== search.domainId) {
            dispatch(
                getArticlePageList(
                    changeSearchOption({
                        ...search,
                        domainId: latestDomainId,
                        page: 0,
                    }),
                ),
            );
        }
    }, [dispatch, latestDomainId, search]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <Form className="mb-2">
            {/* 도메인 선택 */}
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
                    value={search.domainId}
                    onChange={(e) => {
                        dispatch(changeLatestDomainId(e.target.value));
                        history.push(match.path);
                    }}
                >
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form.Row>
            <Form.Group as={Row}>
                {/* 검색조건 */}
                <div className="flex-shrink-0 mr-2">
                    <MokaInput
                        as="select"
                        value={search.searchType}
                        onChange={(e) => {
                            setSearch({
                                ...search,
                                searchType: e.target.value,
                            });
                        }}
                    >
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                {/* 검색어 */}
                <MokaSearchInput
                    className="flex-fill"
                    value={search.keyword}
                    onChange={(e) => {
                        setSearch({
                            ...search,
                            keyword: e.target.value,
                        });
                    }}
                    onSearch={handleSearch}
                />
            </Form.Group>
        </Form>
    );
};

export default ArticlePageSearch;
