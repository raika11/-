import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaInputLabel, MokaSearchInput } from '@components';
import { initialState, getColumnistList, changeSearchOption, clearSearchOption, clearColumnist } from '@store/columnist';

const ColumnistSearch = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    // store 연결.
    const { search: storeSearch } = useSelector((store) => ({
        search: store.columnist.columnlist_list.search,
    }));

    // 검색 스테이트.
    const [search, setSearch] = useState(initialState.columnlist_list.search);

    // 검색 조건 설정.
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'status':
                setSearch({ ...search, status: value });
                break;
            case 'keyword':
                setSearch({ ...search, keyword: value });
                break;
            default:
                return;
        }
    };

    // 검색 조건 초기화
    const handleSearchReset = (e) => {
        dispatch(getColumnistList(clearSearchOption()));
    };

    // 검색
    const handleSearch = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getColumnistList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    // 신규등록 버튼 처리.
    const handleNewColumnlist = () => {
        dispatch(clearColumnist());
        history.push(`/columnist/add`);
    };

    // 검색 스토어 연결.
    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    // 최초 로딩.
    useEffect(() => {
        // console.log('ColumnistSearch start');
        // 첫화면 로딩 시 리스트 조회
        dispatch(getColumnistList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Row className="mb-3">
            {/* 상태정보 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInputLabel as="select" name="status" value={search.status} inputClassName="ft-12" onChange={handleChangeValue} className="mb-0">
                    <option value="">상태정보 전체</option>
                    <option value="Y">상태정보 설정</option>
                    <option value="N">상태정보 해제</option>
                </MokaInputLabel>
            </Col>

            {/* 이름 검색 */}
            <Col xs={4} className="p-0 mr-2">
                <MokaSearchInput
                    name="keyword"
                    placeholder={'칼럼니스트 이름 검색'}
                    value={search.keyword}
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                    buttonClassName="ft-12"
                    inputClassName="ft-12"
                />
            </Col>

            {/* 초기화 버튼 */}
            <Button variant="negative" onClick={handleSearchReset} className="ft-12 mr-2">
                초기화
            </Button>

            <Button variant="positive" onClick={handleNewColumnlist} className="ft-12">
                신규등록
            </Button>
        </Form.Row>
    );
};

export default ColumnistSearch;
