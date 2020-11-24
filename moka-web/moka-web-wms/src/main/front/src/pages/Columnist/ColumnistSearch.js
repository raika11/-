import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaInputLabel, MokaSearchInput } from '@components';
import { initialState, getColumnistList, changeSearchOption, clearSearchOption } from '@store/columNist';

// TODO 검색 버튼 옆 초기화 버튼 추가 필요.
const ColumnistSearch = () => {
    const dispatch = useDispatch();

    // store 연결.
    const { search: storeSearch } = useSelector((store) => ({
        search: store.columNist.columnlist_list.search,
    }));

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

    // 검색 조건 초기화/
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
        <Form.Row className="mb-10">
            {/* 상태정보 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInputLabel label="상태정보" labelWidth={56} as="select" name="status" value={search.status} onChange={handleChangeValue} className="mb-0">
                    <option value="Y">설정</option>
                    <option value="N">해제</option>
                </MokaInputLabel>
            </Col>

            {/* 이름 검색 */}
            <Col xs={4} className="p-0">
                <MokaSearchInput name="keyword" placeholder={'컬럼니스트 이름 검색'} value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
            </Col>

            {/* 초기화 버튼 */}
            <div style={{ width: 85 }} className="d-flex justify-content-center">
                <Button variant="negative" onClick={handleSearchReset}>
                    초기화
                </Button>
            </div>
        </Form.Row>
    );
};

export default ColumnistSearch;
