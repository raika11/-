import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaSearchInput, MokaInput } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { getPageTree, changeSearchOption, initialState, clearPage } from '@store/page';

/**
 * 페이지 검색 컴포넌트
 */
const PageSearch = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList } = useSelector(({ auth }) => ({
        latestDomainId: auth.latestDomainId,
        domainList: auth.domainList,
    }));
    const storeSearch = useSelector(({ page }) => page.search);
    const [search, setSearch] = React.useState(initialState.search);

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

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'domainId') {
            dispatch(changeLatestDomainId(e.target.value));
            dispatch(clearPage());
            history.push(match.path);
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // latestDomainId 변경 => search.domainId 변경
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
        <Form className="mb-2">
            {/* 도메인 선택 */}
            <Form.Row className="mb-2">
                <MokaInput as="select" name="domainId" value={search.domainId} onChange={handleChangeValue}>
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form.Row>
            <Form.Row>
                {/* 검색조건 */}
                <div className="mr-2 flex-shrink-0">
                    <MokaInput as="select" value={search.searchType} name="searchType" onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                {/* 키워드 */}
                <MokaSearchInput value={search.keyword} className="flex-fill" name="keyword" onChange={handleChangeValue} onSearch={handleSearch} />
            </Form.Row>
        </Form>
    );
};

export default PageSearch;
