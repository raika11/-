import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { CONTAINER_GROUP } from '@/constants';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getContainerList, changeSearchOption } from '@store/container';
import { changeLatestDomainId } from '@store/auth';

/**
 * 컨테이너 관리 > 컨테이너 목록 > 검색
 */
const ContainerSearch = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { latestDomainId, domainList } = useSelector(({ auth }) => auth);
    const { search: storeSearch, searchTypeList } = useSelector(({ container }) => container);
    const [search, setSearch] = useState(initialState.search);

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
        } else {
            setSearch({
                ...search,
                [e.target.name]: e.target.value,
            });
        }
    };

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        /**
         * latestDomainId를 컨테이너의 search.domainId로 변경
         */
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

    return (
        <div className="mb-14">
            <Row noGutters>
                <Col xs={8} className="pr-2 mb-2">
                    <MokaInput as="select" value={search.domainId || undefined} onChange={handleChangeSearchOption} name="domainId">
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domainId}>
                                {domain.domainName}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={4}>
                    <MokaInput as="select" value={search.containerGroup} onChange={handleChangeSearchOption} name="containerGroup">
                        {CONTAINER_GROUP.map((grp) => (
                            <option key={grp.value} value={grp.value}>
                                {grp.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
            </Row>

            <Row noGutters>
                <Col xs={3} className="pr-2">
                    <MokaInput as="select" value={search.searchType} onChange={handleChangeSearchOption} name="searchType">
                        {searchTypeList.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <MokaSearchInput className="flex-fill" value={search.keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
            </Row>
        </div>
    );
};

export default ContainerSearch;
