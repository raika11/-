import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaSearchInput } from '@components';
import { initialState, getColumnistList, changeSearchOption, clearSearchOption, clearColumnist } from '@store/columnist';

const ArticleColumnistSearch = () => {
    const dispatch = useDispatch();

    // store
    const { search: storeSearch } = useSelector((store) => ({
        search: store.columnist.columnlist_list.search,
    }));

    // local
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
        // dispatch(clearColumnist());
        // history.push(`${match.path}/add`);
    };

    // 검색 스토어 연결.
    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    // 최초 로딩.
    useEffect(() => {
        // 첫화면 로딩 시 리스트 조회
        dispatch(getColumnistList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Row className="mb-3">
            {/* 상태정보 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInputLabel as="select" name="status" value={search.status} onChange={handleChangeValue} className="mb-0">
                    <option value="">상태정보 전체</option>
                    <option value="Y">상태정보 설정</option>
                    <option value="N">상태정보 해제</option>
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

                <Button variant="positive" onClick={handleNewColumnlist} className="flex-shrink-0">
                    신규등록
                </Button>
            </Col>
        </Form.Row>
    );
};

export default ArticleColumnistSearch;
