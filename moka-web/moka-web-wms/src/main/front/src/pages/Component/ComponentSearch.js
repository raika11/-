import React, { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { MokaSearchInput, MokaInput } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { getComponentList, changeSearchOption, initialState } from '@store/component';
import { getTpZone } from '@store/codeMgt';

/**
 * 컴포넌트 관리 > 컴포넌트 목록 > 검색
 */
const ComponentSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList } = useSelector(({ auth }) => auth, shallowEqual);
    const tpZoneRows = useSelector(({ codeMgt }) => codeMgt, shallowEqual);
    const storeSearch = useSelector(({ component }) => component, shallowEqual);
    const [search, setSearch] = React.useState(initialState.search);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getComponentList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    useEffect(() => {
        // latestDomainId 변경 => 템플릿의 search.domainId 변경
        if (latestDomainId && latestDomainId !== search.domainId) {
            dispatch(
                getComponentList(
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
        if (!tpZoneRows) dispatch(getTpZone());
    }, [dispatch, tpZoneRows]);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <Form className="mb-14">
            {/* 도메인 선택 */}
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
                    value={search.domainId || undefined}
                    onChange={(e) => {
                        dispatch(changeLatestDomainId(e.target.value));
                        history.push('/component');
                    }}
                >
                    {domainList.map((domain) => (
                        <option key={domain.domainId} value={domain.domainId}>
                            {domain.domainName}
                        </option>
                    ))}
                </MokaInput>
            </Form.Row>
            <Form.Row className="mb-2">
                <MokaInput
                    as="select"
                    value={search.templateGroup}
                    onChange={(e) => {
                        setSearch({
                            ...search,
                            templateGroup: e.target.value,
                        });
                    }}
                >
                    <option value="all">위치그룹 전체</option>
                    {tpZoneRows &&
                        tpZoneRows.map((cd) => (
                            <option key={cd.dtlCd} value={cd.dtlCd}>
                                {cd.cdNm}
                            </option>
                        ))}
                </MokaInput>
            </Form.Row>
            <Form.Group as={Row}>
                {/* 검색조건 */}
                <div className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="select"
                        value={search.searchType || 'all'}
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
                {/* 키워드 */}
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

export default ComponentSearch;
