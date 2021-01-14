import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getMemberList, changeSearchOption } from '@store/member';

/**
 * 컨테이너 검색 컴포넌트
 */
const MemberSearch = () => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState(initialState.search);
    const [keyword, setKeyword] = useState('');
    const { searchTypeList, statusList } = useSelector((store) => ({
        searchTypeList: store.member.searchTypeList,
        statusList: store.app.MEMBER_STATUS_CODE,
    }));

    useEffect(() => {
        dispatch(
            getMemberList(
                changeSearchOption({
                    ...search,
                    keyword: keyword,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, keyword, search]);

    const handleSearch = useCallback(() => {
        dispatch(
            getMemberList(
                changeSearchOption({
                    ...search,
                    keyword: keyword,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, keyword, search]);

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    const handleChangeSearchOption = (e) => {
        if (e.target.name === 'searchStatus') {
            setSearch({
                ...search,
                status: e.target.value,
            });
        } else if (e.target.name === 'searchType') {
            setSearch({
                ...search,
                searchType: e.target.value,
            });
        } else if (e.target.name === 'keyword') {
            setKeyword(e.target.value);
        }
    };

    return (
        <Form className="mb-3">
            <Form.Group as={Row}>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput as="select" value={search.status} onChange={handleChangeSearchOption} name="searchStatus">
                        <option key="all" value="">
                            전체
                        </option>
                        {statusList.map((status) => (
                            <option key={status.code} value={status.code}>
                                {status.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="select" value={search.searchType} onChange={handleChangeSearchOption} name="searchType">
                        {searchTypeList.map((searchType) => (
                            <option key={searchType.id} value={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput value={keyword} onChange={handleChangeSearchOption} onSearch={handleSearch} name="keyword" />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default MemberSearch;
