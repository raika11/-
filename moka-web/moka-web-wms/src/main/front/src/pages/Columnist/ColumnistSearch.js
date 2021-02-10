import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaInputLabel, MokaSearchInput } from '@components';
import { initialState, getColumnistList, changeSearchOption, clearColumnist } from '@store/columnist';
import { AuthButton } from '@pages/Auth/AuthButton';

const ColumnistSearch = ({ match }) => {
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
        //dispatch(getColumnistList(clearSearchOption()));
        setSearch(initialState.columnlist_list.search);
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
        history.push(`${match.path}/add`);
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
        <Form.Row className="mb-2">
            {/* 상태정보 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInputLabel as="select" name="status" value={search.status} onChange={handleChangeValue} className="mb-0">
                    <option value="">상태전체</option>
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </MokaInputLabel>
            </Col>

            {/* 이름 검색 */}
            <Col xs={10} className="p-0 d-flex">
                <MokaSearchInput
                    name="keyword"
                    placeholder={'칼럼니스트 이름 검색'}
                    value={search.keyword}
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                    className="flex-fill mr-2"
                />

                {/* 초기화 버튼 */}
                <Button variant="negative" onClick={handleSearchReset} className="mr-2 flex-shrink-0">
                    초기화
                </Button>

                <AuthButton variant="positive" onClick={handleNewColumnlist} className="flex-shrink-0">
                    등록
                </AuthButton>
            </Col>
        </Form.Row>
    );
};

export default ColumnistSearch;
