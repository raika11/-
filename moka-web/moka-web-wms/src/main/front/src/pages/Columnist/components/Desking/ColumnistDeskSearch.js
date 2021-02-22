import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaSearchInput } from '@components';
import { initialState, getColumnistList, changeSearchOption, clearSearchOption } from '@store/columnist';

const ColumnistDeskSearch = (props) => {
    const { show } = props;
    const dispatch = useDispatch();
    const { search: storeSearch } = useSelector((store) => ({
        search: store.columnist.columnlist_list.search,
    }));
    const [search, setSearch] = useState(initialState.columnlist_list.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
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

    /**
     * 검색 조건 초기화
     */
    const handleSearchReset = () => {
        dispatch(getColumnistList(clearSearchOption()));
    };

    /**
     * 검색
     */
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
        // 검색 스토어 연결
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // 최초 로딩
        if (show) {
            dispatch(getColumnistList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <Form.Row className="mb-14">
            {/* 상태정보 */}
            <div className="flex-shrink-0 mr-2">
                <MokaInputLabel as="select" name="status" value={search.status} onChange={handleChangeValue} className="mb-0">
                    <option value="">상태정보 전체</option>
                    <option value="Y">상태정보 설정</option>
                    <option value="N">상태정보 해제</option>
                </MokaInputLabel>
            </div>

            {/* 이름 검색 */}
            <MokaSearchInput
                name="keyword"
                placeholder={'칼럼니스트 이름 검색'}
                value={search.keyword}
                onChange={handleChangeValue}
                onSearch={handleSearch}
                className="flex-fill mr-1"
            />

            {/* 초기화 버튼 */}
            <Button variant="negative" onClick={handleSearchReset} className="flex-shrink-0">
                초기화
            </Button>
        </Form.Row>
    );
};

export default ColumnistDeskSearch;
